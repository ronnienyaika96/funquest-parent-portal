import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Clock, Star, Lock } from 'lucide-react';

interface VideoCardProps {
  title: string;
  thumbnail: string;
  duration: string;
  progress?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isLocked?: boolean;
  stars?: number;
  category: string;
  onClick?: () => void;
}

const difficultyColors = {
  beginner: 'bg-progress-beginner text-foreground',
  intermediate: 'bg-progress-intermediate text-foreground',
  advanced: 'bg-progress-advanced text-foreground',
};

const VideoCard = ({ 
  title, 
  thumbnail, 
  duration, 
  progress = 0, 
  difficulty, 
  isLocked = false,
  stars = 0,
  category,
  onClick 
}: VideoCardProps) => {
  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gradient-to-br from-white to-funquest-purple/5 border-funquest-purple/20 rounded-3xl overflow-hidden ${
        isLocked ? 'opacity-60' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-funquest-blue/20 to-funquest-purple/20 overflow-hidden">
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isLocked ? (
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-funquest-purple group-hover:text-white transition-colors duration-300">
                <Play className="h-8 w-8 ml-1" />
              </div>
            )}
          </div>

          {/* Duration Badge */}
          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{duration}</span>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`${difficultyColors[difficulty]} text-xs font-playful font-semibold border-0`}>
              {difficulty}
            </Badge>
          </div>

          {/* Stars earned */}
          {stars > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-funquest-warning/90 px-2 py-1 rounded-full">
              <Star className="h-3 w-3 text-white fill-current" />
              <span className="text-xs font-bold text-white">{stars}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs font-clean bg-funquest-accent/10 text-funquest-accent border-0">
              {category}
            </Badge>
          </div>
          
          <h3 className="font-playful font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-funquest-purple transition-colors duration-300">
            {title}
          </h3>
          
          {/* Progress Bar */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-clean text-muted-foreground">Progress</span>
                <span className="font-playful font-semibold text-funquest-purple">{progress}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-funquest-purple/10"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;