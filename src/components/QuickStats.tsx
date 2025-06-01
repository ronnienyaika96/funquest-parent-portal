
import React from 'react';

const QuickStats = () => {
  const stats = [
    {
      title: 'Active Children',
      value: '3',
      icon: '👧👦',
      color: 'bg-blue-100 text-blue-600',
      change: '+1 this month'
    },
    {
      title: 'Learning Hours',
      value: '47',
      icon: '⏱️',
      color: 'bg-orange-100 text-orange-600',
      change: '+8 this week'
    },
    {
      title: 'Completed Activities',
      value: '124',
      icon: '🎯',
      color: 'bg-green-100 text-green-600',
      change: '+15 this week'
    },
    {
      title: 'Downloaded Printables',
      value: '23',
      icon: '🖨️',
      color: 'bg-purple-100 text-purple-600',
      change: '+5 this week'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-200 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{stat.title}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
              <p className="text-xs text-green-600 mt-1">{stat.change}</p>
            </div>
            <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
