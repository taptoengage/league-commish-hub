// The Commissioner - Quick Stats Row Component
// Referee-themed statistics chips

import React from 'react';
import { QuickStats } from '@/types/league';
import { Trophy, TrendingUp, Zap, Users } from 'lucide-react';

interface QuickStatsRowProps {
  stats: QuickStats;
}

export const QuickStatsRow: React.FC<QuickStatsRowProps> = ({ stats }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-heading text-lg font-bold">League Stats</h2>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {/* Top Seed */}
        {stats.topSeed && (
          <div className="chip-referee flex items-center gap-1.5 whitespace-nowrap">
            <Trophy className="h-3 w-3 text-sport-amber" />
            <span>
              #1 Seed: <span className="font-bold">{stats.topSeed.displayName}</span>
            </span>
          </div>
        )}

        {/* Points Leader */}
        {stats.pointsForLeader && (
          <div className="chip-referee flex items-center gap-1.5 whitespace-nowrap">
            <TrendingUp className="h-3 w-3 text-sport-green" />
            <span>
              Most PF: <span className="font-bold">{stats.pointsForLeader.points}</span>
            </span>
          </div>
        )}

        {/* Longest Streak */}
        {stats.longestStreak && (
          <div className="chip-referee flex items-center gap-1.5 whitespace-nowrap">
            <Zap className="h-3 w-3 text-sport-blue" />
            <span>
              Hot Streak: <span className="font-bold">{stats.longestStreak.length}W</span>
            </span>
          </div>
        )}

        {/* Team Count */}
        <div className="chip-referee flex items-center gap-1.5 whitespace-nowrap">
          <Users className="h-3 w-3 text-whistle-dark" />
          <span>
            <span className="font-bold">{stats.teamCount}</span> Teams
          </span>
        </div>
      </div>
    </div>
  );
};