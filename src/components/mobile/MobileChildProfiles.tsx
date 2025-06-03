
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Star, Trophy, Clock, BookOpen, TrendingUp } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
  level: number;
  totalPoints: number;
  favoriteActivity: string;
  timeSpent: number;
  achievements: number;
  booksRead: number;
  streak: number;
}

const MobileChildProfiles = () => {
  const [children] = useState<Child[]>([
    {
      id: '1',
      name: 'Emma',
      age: 5,
      avatar: '👧',
      level: 8,
      totalPoints: 1240,
      favoriteActivity: 'Letter Tracing',
      timeSpent: 45,
      achievements: 12,
      booksRead: 8,
      streak: 5
    },
    {
      id: '2',
      name: 'Lucas',
      age: 7,
      avatar: '👦',
      level: 12,
      totalPoints: 2100,
      favoriteActivity: 'Math Games',
      timeSpent: 60,
      achievements: 18,
      booksRead: 15,
      streak: 3
    },
    {
      id: '3',
      name: 'Sophie',
      age: 4,
      avatar: '👶',
      level: 4,
      totalPoints: 680,
      favoriteActivity: 'Coloring',
      timeSpent: 30,
      achievements: 6,
      booksRead: 4,
      streak: 2
    }
  ]);

  const getProgressColor = (level: number) => {
    if (level < 5) return 'from-red-400 to-red-500';
    if (level < 10) return 'from-yellow-400 to-orange-500';
    return 'from-green-400 to-green-500';
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Children 👨‍👩‍👧‍👦</h1>
          <p className="text-gray-600">Track your kids' learning journey</p>
        </div>
        <Button className="fab-primary">
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Children Cards */}
      <div className="space-y-4">
        {children.map((child) => (
          <Card key={child.id} className="overflow-hidden border-0 shadow-medium">
            <CardContent className="p-0">
              {/* Header Section */}
              <div className={`p-6 bg-gradient-to-r ${getProgressColor(child.level)} text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                      {child.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{child.name}</h3>
                      <p className="text-white/80">{child.age} years old</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Edit2 className="w-5 h-5" />
                  </Button>
                </div>

                {/* Level Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Level {child.level}</span>
                    <span className="text-sm font-bold">{child.totalPoints} pts</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-3">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${(child.level / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Streak Counter */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">🔥</span>
                  </div>
                  <span className="text-sm">{child.streak} day learning streak!</span>
                </div>
              </div>

              {/* Stats Section */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-2xl">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-800">{child.timeSpent}h</p>
                      <p className="text-sm text-gray-600">Time played</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-2xl">
                    <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-800">{child.achievements}</p>
                      <p className="text-sm text-gray-600">Badges</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-2xl">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-800">{child.booksRead}</p>
                      <p className="text-sm text-gray-600">Books read</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-2xl">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-800">A+</p>
                      <p className="text-sm text-gray-600">Grade</p>
                    </div>
                  </div>
                </div>

                {/* Favorite Activity */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">Favorite Activity</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 text-sm px-3 py-1">
                    {child.favoriteActivity}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold py-3">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Progress
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-2xl font-bold py-3">
                    Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MobileChildProfiles;
