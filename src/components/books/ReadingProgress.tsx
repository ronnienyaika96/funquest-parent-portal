import React from 'react';
import { Star } from 'lucide-react';

interface ReadingProgressProps {
  currentPage: number;
  totalPages: number;
  stars?: number;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({ currentPage, totalPages, stars = 0 }) => {
  const pct = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;
  return (
    <div className="flex items-center gap-3 w-full max-w-md">
      <div className="flex-1">
        <div className="h-3 rounded-full bg-white/60 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-funquest-green transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs font-bold text-foreground/80 mt-1">
          Page {currentPage} of {totalPages}
        </p>
      </div>
      <div className="flex items-center gap-1 bg-white/90 rounded-full px-3 py-1.5 shadow-medium">
        <Star className="w-4 h-4 text-funquest-yellow fill-funquest-yellow" aria-hidden />
        <span className="font-extrabold text-foreground text-sm">{stars}</span>
      </div>
    </div>
  );
};

export default ReadingProgress;
