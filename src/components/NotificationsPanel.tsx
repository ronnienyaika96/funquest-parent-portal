
import React from 'react';

const NotificationsPanel = () => {
  const notifications = [
    {
      icon: '🎉',
      title: 'Great Progress!',
      message: 'Emma completed 5 activities this week',
      time: '2 hours ago',
      type: 'achievement'
    },
    {
      icon: '📦',
      title: 'Order Shipped',
      message: 'Your Activity Book Set is on the way',
      time: '1 day ago',
      type: 'order'
    },
    {
      icon: '🆕',
      title: 'New Content Available',
      message: 'Check out our latest Bible story activities',
      time: '3 days ago',
      type: 'update'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        🔔 Recent Updates
      </h2>
      
      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
            <span className="text-xl">{notification.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-sky-600 hover:text-sky-700 font-medium text-sm py-2">
        View All Notifications
      </button>
    </div>
  );
};

export default NotificationsPanel;
