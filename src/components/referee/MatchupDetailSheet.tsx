// The Commissioner - Matchup Detail Sheet Component
// Bottom sheet with matchup roster details (mocked for now)

import React from 'react';
import { Matchup } from '@/types/league';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { RefereeAvatar } from './RefereeAvatar';
import { WinProbabilityBar } from './WinProbabilityBar';

interface MatchupDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  matchup: Matchup | null;
}

// Mock roster data for now
const getMockRoster = (teamId: string) => [
  { position: 'QB', name: 'Josh Allen', points: 24.5, projected: 22.1, status: 'active' },
  { position: 'RB', name: 'Christian McCaffrey', points: 18.2, projected: 19.8, status: 'active' },
  { position: 'RB', name: 'Tony Pollard', points: 12.4, projected: 14.2, status: 'active' },
  { position: 'WR', name: 'Tyreek Hill', points: 16.8, projected: 18.5, status: 'active' },
  { position: 'WR', name: 'Stefon Diggs', points: 14.2, projected: 16.1, status: 'active' },
  { position: 'TE', name: 'Travis Kelce', points: 11.6, projected: 13.4, status: 'active' },
  { position: 'FLEX', name: 'Keenan Allen', points: 9.8, projected: 12.3, status: 'active' },
  { position: 'K', name: 'Justin Tucker', points: 8.0, projected: 9.2, status: 'active' },
  { position: 'DEF', name: 'Buffalo Defense', points: 12.0, projected: 11.5, status: 'active' },
];

export const MatchupDetailSheet: React.FC<MatchupDetailSheetProps> = ({
  isOpen,
  onClose,
  matchup,
}) => {
  if (!matchup) return null;

  const { home, away } = matchup;
  const homeRoster = getMockRoster(home.teamId);
  const awayRoster = getMockRoster(away.teamId);

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  };

  const formatRecord = (record?: { wins: number; losses: number; rank?: number }) => {
    if (!record) return '0-0';
    return `${record.wins}-${record.losses}${record.rank ? ` (#${record.rank})` : ''}`;
  };

  const RosterTable = ({ roster, teamName }: { roster: any[]; teamName: string }) => (
    <div className="space-y-2">
      <h4 className="text-heading font-semibold text-sm">{teamName} Roster</h4>
      <div className="space-y-1">
        {roster.map((player, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-lg bg-whistle-light/5 dark:bg-stripe/5">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs min-w-[40px] justify-center">
                {player.position}
              </Badge>
              <span className="text-sm font-medium">{player.name}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="text-center">
                <div className="font-semibold">{player.points}</div>
                <div className="text-muted-foreground">Actual</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-muted-foreground">{player.projected}</div>
                <div className="text-muted-foreground">Proj</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-center">
            <div className="space-y-3">
              {/* Team matchup header */}
              <div className="flex items-center justify-between">
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
              <div className="flex items-center justify-between mb-2">
                <div className="text-center">
                  <div className="text-xl font-black text-sport-green">
                    {home.projected ? `${home.projected.toFixed(1)}` : '--'}
                  </div>
                  <div className="text-xs text-muted-foreground">Projected</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xl font-black text-sport-red">
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
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-6">
          <RosterTable roster={homeRoster} teamName={home.displayName} />
          <RosterTable roster={awayRoster} teamName={away.displayName} />
          
          <div className="text-center text-xs text-muted-foreground pt-4 border-t border-whistle-light/20">
            Mock roster data • Week {matchup.week} projections
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};