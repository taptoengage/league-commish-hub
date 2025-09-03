// The Commissioner - Week Selector Component
// Pill-style week navigation

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekSelectorProps {
  currentWeek: number;
  maxWeek?: number;
  onWeekChange: (week: number) => void;
  className?: string;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({
  currentWeek,
  maxWeek = 18,
  onWeekChange,
  className = '',
}) => {
  const canGoPrevious = currentWeek > 1;
  const canGoNext = currentWeek < maxWeek;

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <button
        onClick={() => canGoPrevious && onWeekChange(currentWeek - 1)}
        disabled={!canGoPrevious}
        className={`p-2 rounded-pill transition-all ${
          canGoPrevious 
            ? 'text-foreground hover:bg-whistle-light/20 active:scale-95' 
            : 'text-muted-foreground cursor-not-allowed'
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="chip-referee text-sm font-bold px-4 py-2">
        Week {currentWeek}
      </div>

      <button
        onClick={() => canGoNext && onWeekChange(currentWeek + 1)}
        disabled={!canGoNext}
        className={`p-2 rounded-pill transition-all ${
          canGoNext 
            ? 'text-foreground hover:bg-whistle-light/20 active:scale-95' 
            : 'text-muted-foreground cursor-not-allowed'
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};