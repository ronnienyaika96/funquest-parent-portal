
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Book, Star, Trophy, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileDashboard = () => {
  const navigate = useNavigate();

  const quickStats = [
    { 
      title: 'Games Played', 
      value: '24', 
      icon: Play, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Books Read', 
      value: '8', 
      icon: Book, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Stars Earned', 
      value: '156', 
      icon: Star, 
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    { 
      title: 'Achievements', 
      value: '12', 
      icon: Trophy, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const recentActivities = [
    { 
      title: 'Letter Tracing A-Z', 
      time: '10 min ago', 
      progress: 85,
      emoji: '✏️'
    },
    { 
      title: 'Rainbow Coloring', 
      time: '1 hour ago', 
      progress: 100,
      emoji: '🎨'
    },
    { 
      title: 'Math Puzzles', 
      time: '2 hours ago', 
      progress: 60,
      emoji: '🧮'
    }
  ];

  return (
    <div className="p-4 space-y-6 pb-24 bg-white">
      {/* Welcome Section */}
      <div className="card-mobile bg-purple-500 text-white mb-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Hi Emma! 👋</h2>
            <p className="text-purple-100 mb-2">Ready for another learning adventure?</p>
            <Button 
              onClick={() => navigate('/games')}
              className="bg-white text-purple-600 hover:bg-purple-50 rounded-2xl font-bold min-h-12 py-3 px-4"
            >
              <Play className="w-5 h-5 mr-2" />
              Continue Learning
            </Button>
          </div>
          <div className="text-6xl opacity-20">🚀</div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`${stat.bgColor} border-0 shadow-soft`}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-2xl bg-${stat.color.includes('blue') ? 'blue' : stat.color.includes('purple') ? 'purple' : stat.color.includes('yellow') ? 'yellow' : 'green'}-500 flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Section */}
      <div className="card-mobile px-3 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800">Today's Progress</h3>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">45 min</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="text-2xl">{activity.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-800">{activity.title}</p>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${activity.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{activity.progress}% Complete</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => navigate('/games')}
          className="bg-orange-500 text-white hover:bg-orange-600 h-14 text-md rounded-2xl"
        >
          🎮 Play Games
        </Button>
        <Button 
          onClick={() => navigate('/shop')}
          className="bg-green-500 text-white hover:bg-green-600 h-14 text-md rounded-2xl"
        >
          📚 Shop Books
        </Button>
      </div>

      {/* Achievement Showcase */}
      <div className="card-mobile bg-yellow-50 py-4 px-3">
        <div className="text-center">
          <div className="text-4xl mb-2">🏆</div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Amazing Progress!</h3>
          <p className="text-gray-600 text-sm mb-4">You're on a 5-day learning streak!</p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((day) => (
              <div key={day} className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
