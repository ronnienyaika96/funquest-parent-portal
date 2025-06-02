
import React from 'react';

const QuickStats = () => {
  const stats = [
    {
      title: 'Active Children',
      value: '3',
      icon: '👧👦',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-600',
      change: '+1 this month'
    },
    {
      title: 'Learning Hours',
      value: '47',
      icon: '⏱️',
      bgColor: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      change: '+8 this week'
    },
    {
      title: 'Completed Activities',
      value: '124',
      icon: '🎯',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
      textColor: 'text-green-600',
      change: '+15 this week'
    },
    {
      title: 'Downloaded Printables',
      value: '23',
      icon: '🖨️',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      textColor: 'text-purple-600',
      change: '+5 this week'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 border border-gray-100`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className="text-xs text-green-600 mt-1">{stat.change}</p>
            </div>
            <div className={`w-16 h-16 ${stat.iconBg} rounded-2xl flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
