
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Trophy, BookOpen, Star, Clock } from 'lucide-react';

export function NotificationsDropdown() {
  const notifications = [
    {
      id: 1,
      type: 'achievement',
      title: 'New Achievement!',
      message: 'Emma earned the "Reading Champion" badge',
      time: '5 min ago',
      icon: Trophy,
      color: 'text-yellow-600'
    },
    {
      id: 2,
      type: 'progress',
      title: 'Daily Goal Reached',
      message: 'Lucas completed 45 minutes of learning today',
      time: '1 hour ago',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'book',
      title: 'Book Completed',
      message: 'Sophie finished reading "The Magic Garden"',
      time: '2 hours ago',
      icon: BookOpen,
      color: 'text-purple-600'
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
            {notifications.length}
          </Badge>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-800">Notifications</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div key={notification.id} className="p-4 border-b hover:bg-gray-50 cursor-pointer">
                <div className="flex space-x-3">
                  <div className={`mt-1 ${notification.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full text-sm">
            View All Notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
