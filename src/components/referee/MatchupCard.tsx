// The Commissioner - Matchup Card Component
// Trading card style matchup display

import React from 'react';
import { Matchup } from '@/types/league';
import { RefereeAvatar } from './RefereeAvatar';
import { WinProbabilityBar } from './WinProbabilityBar';

interface MatchupCardProps {
  matchup: Matchup;
  onTap?: (matchup: Matchup) => void;
}

export const MatchupCard: React.FC<MatchupCardProps> = ({ matchup, onTap }) => {
  const { home, away } = matchup;

  const handleCardTap = () => {
    onTap?.(matchup);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  };

  const formatRecord = (record?: { wins: number; losses: number; rank?: number }) => {
    if (!record) return '0-0';
    return `${record.wins}-${record.losses}${record.rank ? ` (#${record.rank})` : ''}`;
  };

  return (
    <div 
      className="card-referee p-4 cursor-pointer hover:shadow-insetStrong transition-all active:scale-[0.98]"
      onClick={handleCardTap}
    >
      {/* Team matchup header */}
      <div className="flex items-center justify-between mb-3">
        {/* Home team */}
        <div className="flex items-center space-x-3 flex-1">
          <RefereeAvatar 
            src={home.avatarUrl} 
            fallback={getInitials(home.displayName)}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-heading text-sm font-bold truncate">
              {home.displayName}
            </h3>
            {home.handle && (
              <p className="text-xs text-whistle-dark">@{home.handle}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formatRecord(home.record)}
            </p>
          </div>
        </div>

        {/* VS indicator */}
        <div className="mx-4 flex flex-col items-center">
          <div className="chip-referee text-xs font-black px-2 py-1">VS</div>
          <div className="text-xs text-muted-foreground mt-1">Week {matchup.week}</div>
        </div>

        {/* Away team */}
        <div className="flex items-center space-x-3 flex-1 flex-row-reverse">
          <RefereeAvatar 
            src={away.avatarUrl} 
            fallback={getInitials(away.displayName)}
            size="md"
          />
          <div className="min-w-0 flex-1 text-right">
            <h3 className="text-heading text-sm font-bold truncate">
              {away.displayName}
            </h3>
            {away.handle && (
              <p className="text-xs text-whistle-dark">@{away.handle}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formatRecord(away.record)}
            </p>
          </div>
        </div>
      </div>

      {/* Projected scores */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-center">
          <div className="text-lg font-black text-sport-green">
            {home.projected ? `${home.projected.toFixed(1)}` : '--'}
          </div>
          <div className="text-xs text-muted-foreground">Projected</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-black text-sport-red">
            {away.projected ? `${away.projected.toFixed(1)}` : '--'}
          </div>
          <div className="text-xs text-muted-foreground">Projected</div>
        </div>
      </div>

      {/* Win probability bar */}
      {home.winProb !== null && away.winProb !== null && (
        <WinProbabilityBar 
          homeProb={home.winProb} 
          awayProb={away.winProb}
          className="mb-2"
        />
      )}
    </div>
  );
};