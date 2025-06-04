
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContactSupportForm } from './forms/ContactSupportForm';
import { Bell, Settings, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  onEnterGamingMode: () => void;
}

const DashboardHeader = ({ onEnterGamingMode }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 px-0 mx-[20px]">Welcome back, Sarah!</h1>
          <p className="text-gray-600 mx-[20px]">Here's what's happening with your children's learning journey</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button onClick={() => navigate('/admin')} variant="outline" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Admin Panel</span>
          </Button>
          
          <ContactSupportForm />
          
          <div className="relative">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              3
            </Badge>
          </div>
          
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
