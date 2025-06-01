
import React from 'react';

const QuickStats = () => {
  const stats = [
    {
      title: 'Active Children',
      value: '3',
      icon: '👧👦',
      color: 'from-sky-400 to-sky-500',
      change: '+1 this month'
    },
    {
      title: 'Learning Hours',
      value: '47',
      icon: '⏱️',
      color: 'from-yellow-400 to-yellow-500',
      change: '+8 this week'
    },
    {
      title: 'Completed Activities',
      value: '124',
      icon: '🎯',
      color: 'from-green-400 to-green-500',
      change: '+15 this week'
    },
    {
      title: 'Downloaded Printables',
      value: '23',
      icon: '🖨️',
      color: 'from-purple-400 to-purple-500',
      change: '+5 this week'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className="text-xs text-green-600 mt-1">{stat.change}</p>
            </div>
            <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
