
import React from 'react';
import { Bell, Calendar, Gift, BookOpen, AlertCircle } from 'lucide-react';

interface NotificationsPanelProps {
  preview?: boolean;
}

const NotificationsPanel = ({ preview = false }: NotificationsPanelProps) => {
  const notifications = [
    {
      id: 1,
      icon: Gift,
      title: 'Achievement Unlocked!',
      message: 'Emma completed the entire Alphabet series! She earned a gold star badge.',
      time: '2 hours ago',
      type: 'achievement',
      unread: true
    },
    {
      id: 2,
      icon: BookOpen,
      title: 'New Learning Content',
      message: 'New Bible story activities are now available in the printables section.',
      time: '1 day ago',
      type: 'content',
      unread: true
    },
    {
      id: 3,
      icon: Calendar,
      title: 'Weekly Progress Report',
      message: 'Your weekly learning summary is ready to view.',
      time: '2 days ago',
      type: 'report',
      unread: false
    },
    {
      id: 4,
      icon: AlertCircle,
      title: 'Subscription Reminder',
      message: 'Your premium subscription will renew on June 15th.',
      time: '3 days ago',
      type: 'billing',
      unread: false
    },
    {
      id: 5,
      icon: Gift,
      title: 'Special Offer',
      message: 'Get 20% off on all physical activity books this month!',
      time: '5 days ago',
      type: 'promotion',
      unread: false
    }
  ];

  const displayNotifications = preview ? notifications.slice(0, 3) : notifications;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-green-100 text-green-600';
      case 'content': return 'bg-blue-100 text-blue-600';
      case 'report': return 'bg-purple-100 text-purple-600';
      case 'billing': return 'bg-orange-100 text-orange-600';
      case 'promotion': return 'bg-pink-100 text-pink-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-blue-600" />
          Notifications
        </h2>
        {!preview && (
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {displayNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-4 rounded-lg border transition-colors cursor-pointer ${
              notification.unread 
                ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                <notification.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                  {notification.unread && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                <p className="text-xs text-slate-400">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {preview && (
        <button 
          className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          View All Notifications
        </button>
      )}

      {!preview && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Upcoming Events
          </h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• New puzzle games launching next week</li>
            <li>• Monthly learning challenge starts June 1st</li>
            <li>• Summer reading program registration open</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
