
import React from 'react';
import { Users, Package, DollarSign, Gamepad2 } from 'lucide-react';

const AdminOverview = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      change: '+12% this month'
    },
    {
      title: 'Active Subscriptions',
      value: '1,923',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      change: '+8% this month'
    },
    {
      title: 'Book Orders',
      value: '456',
      icon: Package,
      color: 'bg-orange-100 text-orange-600',
      change: '+15% this week'
    },
    {
      title: 'Game Sessions',
      value: '12,843',
      icon: Gamepad2,
      color: 'bg-purple-100 text-purple-600',
      change: '+23% this week'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-200 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-7 h-7" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-700">New user registration: parent@example.com</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-700">Book order completed: ABC Learning Pack</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-slate-700">New game session: Letter Tracing - Letter A</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left">
              Upload New Game Content
            </button>
            <button className="w-full p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-left">
              Review Pending Orders
            </button>
            <button className="w-full p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-left">
              Send Newsletter Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
