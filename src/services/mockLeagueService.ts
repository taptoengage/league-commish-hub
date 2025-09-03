// The Commissioner - Mock League Data Service
// Simulates Sleeper API responses for development

import { LeagueDashboardDTO, ChatPreviewData, ChatMessage, Team } from '@/types/league';

// Mock team data with referee-themed names
const mockTeamData = [
  { teamId: '1', displayName: 'The Whistle Blowers', handle: 'whistlers', avatarUrl: null, record: { wins: 0, losses: 0, rank: 1 } },
  { teamId: '2', displayName: 'Penalty Box Heroes', handle: 'penaltybox', avatarUrl: null, record: { wins: 0, losses: 0, rank: 2 } },
  { teamId: '3', displayName: 'Red Card Rebels', handle: 'redcards', avatarUrl: null, record: { wins: 0, losses: 0, rank: 3 } },
  { teamId: '4', displayName: 'Touchdown Zebras', handle: 'zebras', avatarUrl: null, record: { wins: 0, losses: 0, rank: 4 } },
  { teamId: '5', displayName: 'Flag Throwers', handle: 'flags', avatarUrl: null, record: { wins: 0, losses: 0, rank: 5 } },
  { teamId: '6', displayName: 'Sideline Sheriffs', handle: 'sheriffs', avatarUrl: null, record: { wins: 0, losses: 0, rank: 6 } },
  { teamId: '7', displayName: 'End Zone Enforcers', handle: 'enforcers', avatarUrl: null, record: { wins: 0, losses: 0, rank: 7 } },
  { teamId: '8', displayName: 'Fumble Finders', handle: 'fumblers', avatarUrl: null, record: { wins: 0, losses: 0, rank: 8 } },
];

// Generate random projections between 80-150 points
const getRandomProjection = () => Math.floor(Math.random() * 70) + 80;

// Calculate win probability based on projections
const calculateWinProb = (homeProj: number, awayProj: number): number => {
  const total = homeProj + awayProj;
  return homeProj / total;
};

export const mockLeagueService = {
  async getLeagueDashboard(leagueId: string, week: number = 1): Promise<LeagueDashboardDTO> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create matchups by pairing teams
    const matchups = [];
    for (let i = 0; i < mockTeamData.length; i += 2) {
      const homeProjected = getRandomProjection();
      const awayProjected = getRandomProjection();
      
      const homeWinProb = calculateWinProb(homeProjected, awayProjected);
      
      const home: Team = {
        ...mockTeamData[i],
        projected: homeProjected,
        winProb: homeWinProb,
      };
      
      const away: Team = {
        ...mockTeamData[i + 1],
        projected: awayProjected,
        winProb: 1 - homeWinProb,
      };

      matchups.push({
        id: `matchup_${i / 2 + 1}`,
        week,
        home,
        away,
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
        topSeed: { teamId: '1', displayName: 'The Whistle Blowers' },
        pointsForLeader: { teamId: '4', displayName: 'Touchdown Zebras', points: 1247 },
        longestStreak: { teamId: '3', displayName: 'Red Card Rebels', length: 3 },
        teamCount: 8,
        waiverOrder: ['8', '7', '6', '5', '4', '3', '2', '1'],
      },
    };
  },

  async getChatPreview(leagueId: string): Promise<ChatPreviewData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'The Whistler',
        message: "Ready to get schooled by the refs this week? 📯",
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Flag Thrower',
        message: "My team's about to throw more flags than a penalty convention",
        timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Zebra King',
        message: "Anyone else's bench talking more trash than their starters? 😂",
        timestamp: new Date(Date.now() - 30000), // 30 seconds ago
      },
    ];

    return {
      messages: mockMessages,
      totalCount: 47,
    };
  },
};