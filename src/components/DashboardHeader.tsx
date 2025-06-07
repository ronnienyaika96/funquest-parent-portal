
import React from 'react';
import { Button } from '@/components/ui/button';
import { ContactSupportForm } from './forms/ContactSupportForm';
import { ProfileDropdown } from './forms/ProfileDropdown';
import { NotificationsDropdown } from './forms/NotificationsDropdown';
import { useAuth } from '@/hooks/useAuth';

interface DashboardHeaderProps {
  onEnterGamingMode: () => void;
}

const DashboardHeader = ({ onEnterGamingMode }: DashboardHeaderProps) => {
  const { user } = useAuth();
  
  const firstName = user?.user_metadata?.first_name || 'User';

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mx-[20px]">
            Welcome back, {firstName}!
          </h1>
          <p className="text-gray-600 mx-[20px]">Here's what's happening with your children's learning journey</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <ContactSupportForm />
          <NotificationsDropdown />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
