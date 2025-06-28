
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AchievementHighlights = () => {
  const achievements = [
    {
      emoji: '⭐',
      title: 'Weekly Star',
      description: 'Emma earned 25 stars this week!',
      gradient: 'from-yellow-50 to-orange-50',
      border: 'border-yellow-200'
    },
    {
      emoji: '🏆',
      title: 'Achievement',
      description: 'Reading Champion unlocked!',
      gradient: 'from-green-50 to-emerald-50',
      border: 'border-green-200'
    },
    {
      emoji: '📚',
      title: 'Learning Streak',
      description: '5 days in a row!',
      gradient: 'from-blue-50 to-indigo-50',
      border: 'border-blue-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {achievements.map((achievement, index) => (
        <Card key={index} className={`bg-gradient-to-br ${achievement.gradient} ${achievement.border}`}>
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">{achievement.emoji}</div>
            <h3 className="font-bold text-gray-900">{achievement.title}</h3>
            <p className="text-sm text-gray-600">{achievement.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AchievementHighlights;
