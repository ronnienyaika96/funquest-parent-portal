import React, { useState } from 'react';
import { Plus, Edit2, Star, Trophy, Clock, BookOpen } from 'lucide-react';
import { AddChildForm } from './forms/AddChildForm';

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
}

interface ChildProfilesProps {
  preview?: boolean;
}

const ChildProfiles = ({ preview = false }: ChildProfilesProps) => {
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
      booksRead: 8
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
      booksRead: 15
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
      booksRead: 4
    }
  ]);

  const displayChildren = preview ? children.slice(0, 2) : children;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Children</h2>
          <p className="text-gray-600 mt-1">Manage your children's learning profiles</p>
        </div>
        {!preview && (
          <AddChildForm />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayChildren.map((child) => (
          <div key={child.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{child.avatar}</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{child.name}</h3>
                  <p className="text-gray-500">{child.age} years old</p>
                </div>
              </div>
              {!preview && (
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">Level {child.level}</span>
                  <span className="text-sm font-bold text-blue-900">{child.totalPoints} pts</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(child.level / 20) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">{child.timeSpent}h played</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span className="text-gray-600">{child.achievements} badges</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-600">{child.booksRead} books</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-orange-600" />
                  <span className="text-gray-600">Top activity</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Favorite:</span> {child.favoriteActivity}
                </p>
              </div>

              {!preview && (
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    View Progress
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {preview && children.length > 2 && (
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Showing {displayChildren.length} of {children.length} children
          </p>
        </div>
      )}
    </div>
  );
};

export default ChildProfiles;
