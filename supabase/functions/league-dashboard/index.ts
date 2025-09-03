import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Types
interface SleeperLeague {
  league_id: string;
  name: string;
  season: string;
  settings: {
    playoff_week_start: number;
  };
}

interface SleeperUser {
  user_id: string;
  display_name: string;
  avatar?: string;
}

interface SleeperRoster {
  roster_id: number;
  owner_id: string;
  settings: {
    wins: number;
    losses: number;
    ties: number;
    fpts: number;
    fpts_against: number;
    rank?: number;
  };
}

interface SleeperMatchup {
  roster_id: number;
  matchup_id: number;
  points?: number;
  metadata?: { proj?: number };
}

// Exported DTO types
export type RecordSummary = { wins?: number; losses?: number; ties?: number; rank?: number };
export type TeamSide = {
  teamId: string;
  displayName: string;
  handle?: string;
  avatarUrl?: string;
  projected?: number | null;
  points?: number | null;
  record?: RecordSummary;
  winProb?: number | null; // 0..1
};
export type LeagueDashboardDTO = {
  league: { id: string; name: string; season: number; week: number };
  matchups: Array<{ id: string; week: number; home: TeamSide; away: TeamSide }>;
  quickStats: {
    topSeed?: { teamId: string; displayName: string };
    pointsForLeader?: { teamId: string; displayName: string; points: number };
    longestStreak?: { teamId: string; displayName: string; length: number };
    waiverOrder?: string[];
    teamCount: number;
  };
};

// Cache store (in-memory for this function instance)
const cache = new Map<string, { data: LeagueDashboardDTO; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 60 seconds

// Mock data fallback
const getMockData = (leagueId: string, week: number): LeagueDashboardDTO => {
  const mockTeams = [
    { teamId: '1', displayName: 'The Whistle Blowers', handle: 'whistlers', record: { wins: 8, losses: 4, rank: 1 } },
    { teamId: '2', displayName: 'Penalty Box Heroes', handle: 'penaltybox', record: { wins: 7, losses: 5, rank: 2 } },
    { teamId: '3', displayName: 'Red Card Rebels', handle: 'redcards', record: { wins: 6, losses: 6, rank: 3 } },
    { teamId: '4', displayName: 'Touchdown Zebras', handle: 'zebras', record: { wins: 9, losses: 3, rank: 4 } },
    { teamId: '5', displayName: 'Flag Throwers', handle: 'flags', record: { wins: 5, losses: 7, rank: 5 } },
    { teamId: '6', displayName: 'Sideline Sheriffs', handle: 'sheriffs', record: { wins: 4, losses: 8, rank: 6 } },
    { teamId: '7', displayName: 'End Zone Enforcers', handle: 'enforcers', record: { wins: 10, losses: 2, rank: 7 } },
    { teamId: '8', displayName: 'Fumble Finders', handle: 'fumblers', record: { wins: 3, losses: 9, rank: 8 } },
  ];

  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const matchups = [];
  for (let i = 0; i < mockTeams.length; i += 2) {
    const projected1 = rand(95, 135);
    const projected2 = rand(95, 135);
    const points1 = rand(0, 40);
    const points2 = rand(0, 40);

    const denom = projected1 + projected2;
    const p1 = denom > 0 ? projected1 / denom : 0.5;
    
    matchups.push({
      id: `matchup_${i / 2 + 1}`,
      week,
      home: {
        ...mockTeams[i],
        projected: projected1,
        points: points1,
        winProb: p1,
      },
      away: {
        ...mockTeams[i + 1],
        projected: projected2,
        points: points2,
        winProb: 1 - p1,
      },
    });
  }

  return {
    league: {
      id: leagueId,
      name: "The Commissioner's League",
      season: 2024,
      week,
    },
    matchups,
    quickStats: {
      topSeed: { teamId: '7', displayName: 'End Zone Enforcers' },
      pointsForLeader: { teamId: '4', displayName: 'Touchdown Zebras', points: 1247 },
      longestStreak: { teamId: '7', displayName: 'End Zone Enforcers', length: 5 },
      teamCount: 8,
      waiverOrder: ['8', '7', '6', '5', '4', '3', '2', '1'],
    },
  };
};

// Sleeper API adapter
class SleeperAdapter {
  private baseUrl = 'https://api.sleeper.app/v1';

  async fetchLeague(leagueId: string): Promise<SleeperLeague> {
    const response = await fetch(`${this.baseUrl}/league/${leagueId}`);
    if (!response.ok) throw new Error(`Failed to fetch league: ${response.status}`);
    return response.json();
  }

  async fetchUsers(leagueId: string): Promise<SleeperUser[]> {
    const response = await fetch(`${this.baseUrl}/league/${leagueId}/users`);
    if (!response.ok) throw new Error(`Failed to fetch users: ${response.status}`);
    return response.json();
  }

  async fetchRosters(leagueId: string): Promise<SleeperRoster[]> {
    const response = await fetch(`${this.baseUrl}/league/${leagueId}/rosters`);
    if (!response.ok) throw new Error(`Failed to fetch rosters: ${response.status}`);
    return response.json();
  }

  async fetchMatchups(leagueId: string, week: number): Promise<SleeperMatchup[]> {
    const response = await fetch(`${this.baseUrl}/league/${leagueId}/matchups/${week}`);
    if (!response.ok) throw new Error(`Failed to fetch matchups: ${response.status}`);
    return response.json();
  }

  async getLeagueDashboard(leagueId: string, week: number): Promise<LeagueDashboardDTO> {
    try {
      console.log(`Fetching Sleeper data for league ${leagueId}, week ${week}`);
      
      // Fetch all required data in parallel
      const [league, users, rosters, matchups] = await Promise.all([
        this.fetchLeague(leagueId),
        this.fetchUsers(leagueId),
        this.fetchRosters(leagueId),
        this.fetchMatchups(leagueId, week),
      ]);

      // Create user lookup
      const userLookup = new Map(users.map(user => [user.user_id, user]));
      
      // Create roster lookup with user data
      const rosterLookup = new Map(
        rosters.map(roster => {
          const user = userLookup.get(roster.owner_id);
          return [
            roster.roster_id,
            {
              ...roster,
              user,
              displayName: user?.display_name || `Team ${roster.roster_id}`,
              avatarUrl: user?.avatar ? `https://sleepercdn.com/avatars/thumbs/${user.avatar}` : undefined,
            }
          ];
        })
      );

      // Group matchups by matchup_id
      const matchupGroups = new Map<number, SleeperMatchup[]>();
      matchups.forEach(matchup => {
        const group = matchupGroups.get(matchup.matchup_id) || [];
        group.push(matchup);
        matchupGroups.set(matchup.matchup_id, group);
      });

      // Convert to normalized matchups
      const normalizedMatchups = Array.from(matchupGroups.entries()).map(([matchupId, matchupPair]) => {
        if (matchupPair.length !== 2) {
          console.warn(`Matchup ${matchupId} has ${matchupPair.length} teams, skipping`);
          return null;
        }

        // Deterministic pairing: lower roster_id = home, higher = away
        const [homeTeam, awayTeam] = [...matchupPair].sort((a, b) => a.roster_id - b.roster_id);
        const homeRoster = rosterLookup.get(homeTeam.roster_id);
        const awayRoster = rosterLookup.get(awayTeam.roster_id);

        if (!homeRoster || !awayRoster) {
          console.warn(`Missing roster data for matchup ${matchupId}`);
          return null;
        }

        // Win probability: prefer projections, fallback to points
        const b1 = (homeTeam.metadata?.proj ?? homeTeam.points ?? 0);
        const b2 = (awayTeam.metadata?.proj ?? awayTeam.points ?? 0);
        const denom = b1 + b2;
        const homeWinProb = denom > 0 ? b1 / denom : 0.5;

        const id = `sleeper:${leagueId}:${week}:${matchupId}`;
        const r1 = (homeRoster as any)?.settings ?? {};
        const r2 = (awayRoster as any)?.settings ?? {};

        return {
          id,
          week,
          home: {
            teamId: homeRoster.roster_id.toString(),
            displayName: homeRoster.displayName,
            handle: homeRoster.user?.display_name?.toLowerCase().replace(/\s+/g, '') || undefined,
            avatarUrl: homeRoster.avatarUrl,
            points: homeTeam.points ?? null,
            projected: homeTeam.metadata?.proj ?? null,
            record: {
              wins: r1.wins ?? 0,
              losses: r1.losses ?? 0,
              ties: r1.ties ?? 0,
              rank: r1.rank ?? undefined,
            },
            winProb: homeWinProb,
          },
          away: {
            teamId: awayRoster.roster_id.toString(),
            displayName: awayRoster.displayName,
            handle: awayRoster.user?.display_name?.toLowerCase().replace(/\s+/g, '') || undefined,
            avatarUrl: awayRoster.avatarUrl,
            points: awayTeam.points ?? null,
            projected: awayTeam.metadata?.proj ?? null,
            record: {
              wins: r2.wins ?? 0,
              losses: r2.losses ?? 0,
              ties: r2.ties ?? 0,
              rank: r2.rank ?? undefined,
            },
            winProb: 1 - homeWinProb,
          },
        };
      }).filter(Boolean) as Array<{ id: string; week: number; home: TeamSide; away: TeamSide }>;

      // Calculate quick stats
      const sortedByWins = [...rosters].sort((a, b) => b.settings.wins - a.settings.wins);
      const sortedByPoints = [...rosters].sort((a, b) => b.settings.fpts - a.settings.fpts);
      
      const topSeedRoster = rosterLookup.get(sortedByWins[0]?.roster_id);
      const pointsLeaderRoster = rosterLookup.get(sortedByPoints[0]?.roster_id);

      const quickStats = {
        topSeed: topSeedRoster ? {
          teamId: topSeedRoster.roster_id.toString(),
          displayName: topSeedRoster.displayName,
        } : undefined,
        pointsForLeader: pointsLeaderRoster ? {
          teamId: pointsLeaderRoster.roster_id.toString(),
          displayName: pointsLeaderRoster.displayName,
          points: Math.round(pointsLeaderRoster.settings.fpts),
        } : undefined,
        teamCount: rosters.length,
        waiverOrder: rosters
          .sort((a, b) => (b.settings.fpts_against || 0) - (a.settings.fpts_against || 0))
          .map(r => r.roster_id.toString()),
      };

      return {
        league: {
          id: leagueId,
          name: league.name,
          season: parseInt(league.season),
          week,
        },
        matchups: normalizedMatchups,
        quickStats,
      };
    } catch (error) {
      console.error('Sleeper API error:', error);
      throw error;
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    if (url.pathname.endsWith('/api/health')) {
      return new Response(
        JSON.stringify({ ok: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const pathParts = url.pathname.split('/');
    
    // Extract leagueId from path: /api/league/:leagueId/dashboard
    const leagueIdIndex = pathParts.indexOf('league') + 1;
    const leagueId = pathParts[leagueIdIndex];
    
    if (!leagueId) {
      return new Response(
        JSON.stringify({ error: 'League ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const weekParam = url.searchParams.get('week');
    const week = weekParam ? parseInt(weekParam) : 1;
    const forceRefresh = url.searchParams.get('force') === 'true';

    // Check cache first (unless force refresh)
    const cacheKey = `sleeper:${leagueId}:${week}`;
    if (!forceRefresh && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)!;
      const age = Date.now() - cached.timestamp;
      
      if (age < CACHE_DURATION) {
        console.log(`Cache hit for ${cacheKey}, age: ${age}ms`);
        return new Response(
          JSON.stringify(cached.data),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'Cache-Control': 'max-age=60, stale-while-revalidate=300',
              'X-Cache': 'HIT'
            }
          }
        );
      }
    }

    // Try Sleeper API first
    const adapter = new SleeperAdapter();
    let data: LeagueDashboardDTO | null = null;
    
    try {
      data = await adapter.getLeagueDashboard(leagueId, week);
      console.log(`Sleeper API success for league ${leagueId}, week ${week}`);
    } catch (error) {
      console.warn(`Sleeper API failed, attempting mock fallback: ${error}`);
      try {
        data = getMockData(leagueId, week);
      } catch (fallbackErr) {
        console.error('Mock fallback failed:', fallbackErr);
        return new Response(
          JSON.stringify({ error: { code: 'UPSTREAM_FAIL', message: String(error) } }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Cache the result
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return new Response(
      JSON.stringify(data),
      { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'max-age=60, stale-while-revalidate=300',
            'X-Cache': 'MISS'
          }
      }
    );

  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});