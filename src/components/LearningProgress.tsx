
import React from 'react';

interface LearningProgressProps {
  preview: boolean;
}

const LearningProgress: React.FC<LearningProgressProps> = ({ preview }) => {
  const activities = [
    { name: 'Letter Tracing', progress: 85, color: 'from-blue-400 to-blue-500', icon: '✏️' },
    { name: 'Number Learning', progress: 60, color: 'from-green-400 to-green-500', icon: '🔢' },
    { name: 'Bible Stories', progress: 45, color: 'from-purple-400 to-purple-500', icon: '📖' },
    { name: 'Animal Facts', progress: 90, color: 'from-yellow-400 to-yellow-500', icon: '🦁' },
    { name: 'Coloring Pages', progress: 75, color: 'from-pink-400 to-pink-500', icon: '🎨' }
  ];

  const displayActivities = preview ? activities.slice(0, 3) : activities;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        📊 Learning Progress
      </h2>

      <div className="space-y-4">
        {displayActivities.map((activity, index) => (
          <div key={index} className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{activity.icon}</span>
                <span className="font-medium text-gray-900">{activity.name}</span>
              </div>
              <span className="text-sm font-bold text-gray-700">{activity.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${activity.color} h-2 rounded-full transition-all duration-700`}
                style={{ width: `${activity.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {!preview && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-2">🏆 This Week's Achievements</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Completed all A-M letter tracing</li>
              <li>• Finished 5 animal coloring pages</li>
              <li>• Learned about Noah's Ark</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-2">🎯 Learning Goals</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Complete N-Z letter tracing</li>
              <li>• Learn numbers 11-20</li>
              <li>• Read 3 new Bible stories</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningProgress;
