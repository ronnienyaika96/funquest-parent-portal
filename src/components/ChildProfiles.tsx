
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface ChildProfilesProps {
  preview: boolean;
}

const ChildProfiles: React.FC<ChildProfilesProps> = ({ preview }) => {
  const [children] = useState([
    {
      id: 1,
      name: 'Emma',
      age: 6,
      avatar: '👧',
      level: 'Beginner',
      progress: 75,
      lastActivity: 'Letter Tracing - A to M',
      badges: ['🌟', '🎨', '📝']
    },
    {
      id: 2,
      name: 'Lucas',
      age: 4,
      avatar: '👦',
      level: 'Explorer',
      progress: 45,
      lastActivity: 'Animal Coloring',
      badges: ['🦁', '🎯']
    },
    {
      id: 3,
      name: 'Sophia',
      age: 7,
      avatar: '👧',
      level: 'Advanced',
      progress: 90,
      lastActivity: 'Bible Stories Puzzle',
      badges: ['🌟', '📚', '🎨', '✨']
    }
  ]);

  const displayChildren = preview ? children.slice(0, 2) : children;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          👧👦 My Children
        </h2>
        <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Child</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayChildren.map((child) => (
          <div key={child.id} className="bg-gradient-to-br from-sky-50 to-yellow-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-md">
                {child.avatar}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{child.name}</h3>
                <p className="text-sm text-gray-600">Age {child.age} • {child.level}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Learning Progress</span>
                <span className="text-sm font-bold text-sky-600">{child.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-sky-400 to-yellow-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${child.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Last Activity:</p>
              <p className="text-sm font-medium text-gray-900">{child.lastActivity}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                {child.badges.map((badge, index) => (
                  <span key={index} className="text-lg">{badge}</span>
                ))}
              </div>
              <button className="text-sky-600 hover:text-sky-700 font-medium text-sm">
                Manage →
              </button>
            </div>
          </div>
        ))}
      </div>

      {preview && children.length > 2 && (
        <div className="mt-6 text-center">
          <p className="text-gray-600">+{children.length - 2} more children</p>
        </div>
      )}
    </div>
  );
};

export default ChildProfiles;
