// The Commissioner - Win Probability Bar Component
// Scoreboard-style probability indicator

import React from 'react';

interface WinProbabilityBarProps {
  homeProb: number; // 0-1
  awayProb: number; // 0-1
  className?: string;
}

export const WinProbabilityBar: React.FC<WinProbabilityBarProps> = ({
  homeProb,
  awayProb,
  className = '',
}) => {
  const homePercent = Math.round(homeProb * 100);
  const awayPercent = Math.round(awayProb * 100);

  return (
    <div className={`winprob-bar relative ${className}`}>
      {/* Home team (left) */}
      <div 
        className="absolute left-0 top-0 h-full bg-sport-green rounded-l-pill transition-all duration-300"
        style={{ width: `${homePercent}%` }}
      />
      {/* Away team (right) */}
      <div 
        className="absolute right-0 top-0 h-full bg-sport-red rounded-r-pill transition-all duration-300"
        style={{ width: `${awayPercent}%` }}
      />
      
      {/* Percentage labels */}
      <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-semibold">
        <span className="text-cream drop-shadow-sm">{homePercent}%</span>
        <span className="text-cream drop-shadow-sm">{awayPercent}%</span>
      </div>
    </div>
  );
};