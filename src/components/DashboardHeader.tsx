
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContactSupportForm } from './forms/ContactSupportForm';
import { ProfileDropdown } from './forms/ProfileDropdown';
import { NotificationsDropdown } from './forms/NotificationsDropdown';
import { useAuth } from '@/hooks/useAuth';
import { Search, Star, Zap } from 'lucide-react';

interface DashboardHeaderProps {
  onEnterGamingMode: () => void;
}

const DashboardHeader = ({ onEnterGamingMode }: DashboardHeaderProps) => {
  const { user } = useAuth();
  
  const firstName = user?.user_metadata?.first_name || 'Explorer';

  return (
    <header className="bg-gradient-to-r from-white via-funquest-purple/5 to-funquest-pink/5 border-b border-funquest-purple/10 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌟</span>
              <h1 className="text-2xl font-playful font-bold bg-gradient-to-r from-funquest-purple to-funquest-pink bg-clip-text text-transparent">
                Welcome back, {firstName}!
              </h1>
            </div>
            {/* Streak Indicator */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-funquest-warning/10 to-funquest-orange/10 px-3 py-1 rounded-full border border-funquest-warning/20">
              <Zap className="h-4 w-4 text-funquest-warning" />
              <span className="text-sm font-playful font-semibold text-funquest-orange">5 day streak!</span>
            </div>
          </div>
          <p className="text-muted-foreground font-clean mb-4">Discover amazing learning adventures today!</p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search for courses, activities..."
              className="pl-10 rounded-full border-funquest-purple/20 focus:border-funquest-purple/40 bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center space-x-4 mr-4">
            <div className="flex items-center space-x-2 bg-funquest-success/10 px-3 py-2 rounded-full">
              <Star className="h-4 w-4 text-funquest-success" />
              <span className="text-sm font-playful font-semibold text-funquest-success">245 stars</span>
            </div>
          </div>
          
          <ContactSupportForm />
          <NotificationsDropdown />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
