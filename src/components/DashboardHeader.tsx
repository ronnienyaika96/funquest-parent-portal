
import React from 'react';
import { User, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onEnterGamingMode?: () => void;
}

const DashboardHeader = ({ onEnterGamingMode }: DashboardHeaderProps) => {
  return (
    <header className="bg-white shadow-lg border-b-4 border-yellow-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-yellow-400 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              F
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FunQuest Parent Dashboard</h1>
              <p className="text-gray-600">Manage your children's learning journey</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={onEnterGamingMode}
              className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transform transition-all hover:scale-105"
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              Child Mode
            </Button>
            
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">Welcome back!</p>
              <p className="text-sm text-gray-600">Sarah Johnson</p>
            </div>
            <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white">
              <User className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
