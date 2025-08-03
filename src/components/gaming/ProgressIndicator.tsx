import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Star } from 'lucide-react';
import { useTracingProgress } from '@/hooks/useTracingProgress';

interface ProgressIndicatorProps {
  letter?: string;
  showOverall?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  letter,
  showOverall = true,
}) => {
  const { getProgressStats, getLetterProgress } = useTracingProgress();
  
  const stats = getProgressStats();
  const letterProgress = letter ? getLetterProgress(letter) : null;

  if (letter && letterProgress) {
    return (
      <div className="flex items-center gap-3 p-4 bg-card rounded-xl border">
        <div className="flex items-center gap-2">
          {letterProgress.completed ? (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground" />
          )}
          <span className="font-semibold text-lg">Letter {letter.toUpperCase()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium">{letterProgress.score}/100</span>
        </div>
        
        <Badge variant={letterProgress.completed ? "default" : "secondary"}>
          {letterProgress.attempts} attempt{letterProgress.attempts !== 1 ? 's' : ''}
        </Badge>
      </div>
    );
  }

  if (showOverall) {
    return (
      <div className="p-4 bg-card rounded-xl border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Overall Progress</h3>
          <Badge variant="outline">
            {stats.completed}/{stats.total} completed
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Letters mastered</span>
            <span className="font-medium">{stats.percentage}%</span>
          </div>
          <Progress value={stats.percentage} className="h-3" />
        </div>
        
        {stats.percentage === 100 && (
          <div className="flex items-center gap-2 mt-3 text-green-600">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">Alphabet completed! 🎉</span>
          </div>
        )}
      </div>
    );
  }

  return null;
};