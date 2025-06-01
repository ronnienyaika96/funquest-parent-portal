
import React from 'react';
import { User, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onEnterGamingMode?: () => void;
}

const DashboardHeader = ({ onEnterGamingMode }: DashboardHeaderProps) => {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back!</h1>
            <p className="text-slate-600">Manage your children's learning journey</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={onEnterGamingMode}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              Child Mode
            </Button>
            
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-900">Sarah Johnson</p>
              <p className="text-xs text-slate-500">Premium Member</p>
            </div>
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
