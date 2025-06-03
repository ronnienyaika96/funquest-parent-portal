
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, Menu, Search, Star } from 'lucide-react';

interface MobileHeaderProps {
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  onMenuClick?: () => void;
}

const MobileHeader = ({ 
  title = "FunQuest", 
  showSearch = false, 
  showNotifications = true,
  onMenuClick 
}: MobileHeaderProps) => {
  const [searchVisible, setSearchVisible] = useState(false);

  return (
    <header className="bg-gradient-to-r from-yellow-400 to-orange-400 safe-area-top">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-3">
            {onMenuClick && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onMenuClick}
                className="text-white hover:bg-white/20 rounded-xl"
              >
                <Menu className="w-6 h-6" />
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-nunito">{title}</h1>
                <p className="text-yellow-100 text-sm">Learning Adventure</p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {showSearch && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSearchVisible(!searchVisible)}
                className="text-white hover:bg-white/20 rounded-xl"
              >
                <Search className="w-5 h-5" />
              </Button>
            )}

            {showNotifications && (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20 rounded-xl"
                >
                  <Bell className="w-5 h-5" />
                </Button>
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  3
                </Badge>
              </div>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {searchVisible && (
          <div className="mt-4 animate-slide-up">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search games, books, activities..."
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl shadow-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
