
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Trophy, Star, Clock, BookOpen, Filter, Download } from 'lucide-react';
import { ProgressIndicator } from './gaming/ProgressIndicator';
import { useTracingProgress } from '@/hooks/useTracingProgress';

interface LearningProgressProps {
  preview?: boolean;
}

const LearningProgress = ({ preview = false }: LearningProgressProps) => {
  const [selectedChild, setSelectedChild] = useState('all');
  const [timeRange, setTimeRange] = useState('week');
  
  // Get real tracing progress data
  const { getProgressStats } = useTracingProgress();
  const progressStats = getProgressStats();

  const weeklyProgress = [
    { day: 'Mon', minutes: 45, activities: 5 },
    { day: 'Tue', minutes: 30, activities: 3 },
    { day: 'Wed', minutes: 60, activities: 7 },
    { day: 'Thu', minutes: 35, activities: 4 },
    { day: 'Fri', minutes: 50, activities: 6 },
    { day: 'Sat', minutes: 70, activities: 8 },
    { day: 'Sun', minutes: 40, activities: 5 }
  ];

  const skillProgress = [
    { name: 'Reading', value: 85, color: '#3B82F6' },
    { name: 'Math', value: 72, color: '#10B981' },
    { name: 'Writing', value: 68, color: '#F59E0B' },
    { name: 'Science', value: 79, color: '#8B5CF6' }
  ];

  const achievements = [
    { title: 'Reading Champion', description: 'Read 10 books this month', icon: '📚', earned: true },
    { title: 'Math Wizard', description: 'Completed 50 math problems', icon: '🧮', earned: true },
    { title: 'Creative Artist', description: 'Finished 20 coloring pages', icon: '🎨', earned: false },
    { title: 'Story Teller', description: 'Created 5 stories', icon: '📖', earned: false }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Learning Progress</h2>
          <p className="text-gray-600 mt-1">Track your children's learning journey</p>
        </div>
        {!preview && (
          <div className="flex space-x-3">
            <select 
              value={selectedChild} 
              onChange={(e) => setSelectedChild(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Children</option>
              <option value="emma">Emma</option>
              <option value="lucas">Lucas</option>
              <option value="sophie">Sophie</option>
            </select>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Time</p>
              <p className="text-2xl font-bold text-blue-900">24.5h</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-green-50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Activities</p>
              <p className="text-2xl font-bold text-green-900">156</p>
            </div>
            <Star className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Achievements</p>
              <p className="text-2xl font-bold text-yellow-900">12</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Books Read</p>
              <p className="text-2xl font-bold text-purple-900">27</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Real Letter Tracing Progress */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <ProgressIndicator showOverall={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={preview ? 200 : 300}>
            <BarChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="minutes" fill="#3B82F6" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Development</h3>
          <div className="space-y-4">
            {[
              { name: 'Letter Tracing', value: progressStats.percentage, color: '#3B82F6' },
              ...skillProgress.slice(1) // Keep other mock skills for now
            ].map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{skill.name}</span>
                  <span className="text-gray-600">{skill.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${skill.value}%`,
                      backgroundColor: skill.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      {!preview && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`border-2 rounded-xl p-4 transition-all ${
                  achievement.earned 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className={`font-medium ${achievement.earned ? 'text-green-900' : 'text-gray-600'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${achievement.earned ? 'text-green-700' : 'text-gray-500'}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <Trophy className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningProgress;
