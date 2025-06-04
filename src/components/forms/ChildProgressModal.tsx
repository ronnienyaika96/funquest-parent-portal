
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Trophy, Clock, BookOpen, Star, Target } from 'lucide-react';

interface ChildProgressModalProps {
  child: {
    id: string;
    name: string;
    level: number;
    totalPoints: number;
    timeSpent: number;
    achievements: number;
    booksRead: number;
  };
}

export function ChildProgressModal({ child }: ChildProgressModalProps) {
  const weeklyProgress = [
    { day: 'Mon', minutes: 45 },
    { day: 'Tue', minutes: 30 },
    { day: 'Wed', minutes: 60 },
    { day: 'Thu', minutes: 35 },
    { day: 'Fri', minutes: 50 },
    { day: 'Sat', minutes: 70 },
    { day: 'Sun', minutes: 40 }
  ];

  const skillAreas = [
    { name: 'Reading', progress: 85, color: 'bg-blue-500' },
    { name: 'Math', progress: 72, color: 'bg-green-500' },
    { name: 'Writing', progress: 68, color: 'bg-yellow-500' },
    { name: 'Science', progress: 79, color: 'bg-purple-500' }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold py-3">
          <TrendingUp className="w-4 h-4 mr-2" />
          View Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{child.name}'s Learning Progress</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">{child.timeSpent}h</p>
                <p className="text-sm text-blue-700">Time Played</p>
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-50">
              <CardContent className="p-4 text-center">
                <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-900">{child.achievements}</p>
                <p className="text-sm text-yellow-700">Achievements</p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-900">{child.booksRead}</p>
                <p className="text-sm text-purple-700">Books Read</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50">
              <CardContent className="p-4 text-center">
                <Star className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">{child.totalPoints}</p>
                <p className="text-sm text-green-700">Total Points</p>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Activity */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                This Week's Activity
              </h3>
              <div className="space-y-3">
                {weeklyProgress.map((day) => (
                  <div key={day.day} className="flex items-center space-x-3">
                    <span className="w-8 text-sm font-medium text-gray-600">{day.day}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(day.minutes / 70) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">{day.minutes}m</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skill Progress */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Skill Development
              </h3>
              <div className="space-y-4">
                {skillAreas.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">{skill.name}</span>
                      <span className="text-gray-600">{skill.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${skill.color}`}
                        style={{ width: `${skill.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
