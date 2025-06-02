
import React, { useState } from 'react';
import { Bell, Star, Trophy, BookOpen, Calendar, X, Check, Settings } from 'lucide-react';

interface Notification {
  id: string;
  type: 'achievement' | 'progress' | 'reminder' | 'update';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  priority: 'low' | 'medium' | 'high';
}

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'achievement',
      title: 'New Achievement Unlocked!',
      message: 'Emma earned the "Reading Champion" badge for completing 10 books!',
      time: '2 hours ago',
      read: false,
      icon: '🏆',
      priority: 'high'
    },
    {
      id: '2',
      type: 'progress',
      title: 'Weekly Progress Update',
      message: 'Lucas completed 7 activities this week and improved his math skills by 15%',
      time: '1 day ago',
      read: false,
      icon: '📊',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Daily Learning Time',
      message: 'Sophie hasn\'t played any games today. Encourage her to continue learning!',
      time: '3 hours ago',
      read: true,
      icon: '⏰',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'update',
      title: 'New Content Available',
      message: 'Fresh coloring pages and math puzzles have been added to the library',
      time: '2 days ago',
      read: true,
      icon: '🎨',
      priority: 'low'
    },
    {
      id: '5',
      type: 'achievement',
      title: 'Milestone Reached',
      message: 'Congratulations! Your family has spent 100 hours learning together',
      time: '3 days ago',
      read: false,
      icon: '🎉',
      priority: 'high'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'achievements' | 'progress'>('all');

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread': return !notif.read;
      case 'achievements': return notif.type === 'achievement';
      case 'progress': return notif.type === 'progress';
      default: return true;
    }
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-100 text-yellow-800';
      case 'progress': return 'bg-blue-100 text-blue-800';
      case 'reminder': return 'bg-orange-100 text-orange-800';
      case 'update': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-green-500';
      default: return 'border-l-4 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            <p className="text-gray-600">Stay updated with your children's progress</p>
          </div>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={markAllAsRead}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Mark all read
          </button>
          <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-1">
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'achievements', label: 'Achievements' },
            { key: 'progress', label: 'Progress' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.key === 'unread' && unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div 
            key={notification.id}
            className={`bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all ${
              !notification.read ? 'ring-2 ring-blue-100' : ''
            } ${getPriorityBorder(notification.priority)}`}
          >
            <div className="flex items-start space-x-4">
              <div className="text-2xl">{notification.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                    <p className="text-gray-400 text-xs">{notification.time}</p>
                  </div>
                  <div className="flex space-x-1 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔔</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">
            {filter === 'unread' 
              ? "You're all caught up! No unread notifications."
              : "No notifications found for the selected filter."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
