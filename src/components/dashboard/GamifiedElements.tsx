import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Zap, Medal, Crown, Gem } from 'lucide-react';

const GamifiedElements = () => {
  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Completed your first lesson!",
      icon: Star,
      color: "funquest-warning",
      unlocked: true,
      rarity: "bronze"
    },
    {
      id: 2,
      title: "Speed Learner",
      description: "Finished 5 lessons in one day!",
      icon: Zap,
      color: "funquest-blue",
      unlocked: true,
      rarity: "silver"
    },
    {
      id: 3,
      title: "Quiz Master",
      description: "Perfect score on 10 quizzes!",
      icon: Trophy,
      color: "funquest-success",
      unlocked: false,
      rarity: "gold"
    },
    {
      id: 4,
      title: "Learning Champion",
      description: "30-day learning streak!",
      icon: Crown,
      color: "funquest-purple",
      unlocked: false,
      rarity: "diamond"
    }
  ];

  const learningStreak = {
    current: 5,
    best: 12,
    nextMilestone: 7
  };

  const levelProgress = {
    current: 3,
    next: 4,
    progress: 75,
    pointsToNext: 125
  };

  const rarityStyles = {
    bronze: "border-badge-bronze bg-badge-bronze/10",
    silver: "border-badge-silver bg-badge-silver/10",
    gold: "border-badge-gold bg-badge-gold/10",
    diamond: "border-badge-diamond bg-badge-diamond/10"
  };

  return (
    <div className="space-y-6">
      {/* Level & Streak Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Level Progress */}
        <Card className="bg-gradient-to-br from-white to-funquest-purple/5 border-funquest-purple/20 rounded-3xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-funquest-purple to-funquest-pink rounded-2xl flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-playful font-bold text-lg text-funquest-purple">Level {levelProgress.current}</h3>
                <p className="text-sm font-clean text-muted-foreground">Learning Explorer</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-clean text-muted-foreground">Progress to Level {levelProgress.next}</span>
                <span className="text-sm font-playful font-semibold text-funquest-purple">{levelProgress.pointsToNext} points to go!</span>
              </div>
              <Progress 
                value={levelProgress.progress} 
                className="h-3 bg-funquest-purple/10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Learning Streak */}
        <Card className="bg-gradient-to-br from-white to-funquest-warning/5 border-funquest-warning/20 rounded-3xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-funquest-warning to-funquest-orange rounded-2xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-playful font-bold text-lg text-funquest-warning">
                  {learningStreak.current} Day Streak!
                </h3>
                <p className="text-sm font-clean text-muted-foreground">Best: {learningStreak.best} days</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-clean text-muted-foreground">Next milestone</span>
                <span className="text-sm font-playful font-semibold text-funquest-warning">{learningStreak.nextMilestone} days</span>
              </div>
              <Progress 
                value={(learningStreak.current / learningStreak.nextMilestone) * 100} 
                className="h-3 bg-funquest-warning/10"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="bg-gradient-to-br from-white to-funquest-accent/5 border-funquest-accent/20 rounded-3xl shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-funquest-accent to-funquest-green rounded-2xl flex items-center justify-center">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-playful font-bold text-xl text-funquest-accent">Achievements</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              
              return (
                <div
                  key={achievement.id}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                    achievement.unlocked 
                      ? `${rarityStyles[achievement.rarity as keyof typeof rarityStyles]} hover:scale-105 cursor-pointer` 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  {achievement.unlocked && (
                    <div className="absolute -top-2 -right-2">
                      <Gem className="h-5 w-5 text-funquest-success fill-current" />
                    </div>
                  )}
                  
                  <div className="text-center space-y-3">
                    <div className={`mx-auto w-12 h-12 rounded-2xl flex items-center justify-center ${
                      achievement.unlocked 
                        ? `bg-${achievement.color}`
                        : 'bg-gray-300'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    
                    <div>
                      <h4 className={`font-playful font-bold text-sm ${
                        achievement.unlocked ? 'text-foreground' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-xs font-clean ${
                        achievement.unlocked ? 'text-muted-foreground' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>

                    <Badge 
                      variant="secondary" 
                      className={`text-xs font-bold capitalize ${
                        achievement.unlocked ? '' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {achievement.rarity}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamifiedElements;