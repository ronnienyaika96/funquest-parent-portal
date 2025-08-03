
import React from 'react';
import { useQuickStats } from '@/hooks/useQuickStats';

const QuickStats = () => {
  const { stats, isLoading } = useQuickStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-gray-50 rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

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
