// The Commissioner - League Data Types
// Based on normalized Sleeper API responses

export interface TeamRecord {
  wins: number;
  losses: number;
  ties?: number;
  rank?: number;
}

export interface Team {
  teamId: string;
  displayName: string;
  handle?: string;
  avatarUrl?: string;
  projected: number | null;
  record?: TeamRecord;
  winProb?: number | null; // 0-1
}

export interface Matchup {
  id: string; // unique per pairing
  week: number;
  home: Team;
  away: Team;
}

export interface QuickStats {
  topSeed?: { teamId: string; displayName: string };
  pointsForLeader?: { teamId: string; displayName: string; points: number };
  longestStreak?: { teamId: string; displayName: string; length: number };
  waiverOrder?: string[]; // optional
  teamCount: number;
}

export interface League {
  id: string;
  name: string;
  season: number;
  week: number;
}

export interface LeagueDashboardDTO {
  league: League;
  matchups: Matchup[];
  quickStats: QuickStats;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: Date;
}

export interface ChatPreviewData {
  messages: ChatMessage[];
  totalCount: number;
}