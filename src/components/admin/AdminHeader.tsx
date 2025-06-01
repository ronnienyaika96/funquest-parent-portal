
import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  onExitAdmin: () => void;
}

const AdminHeader = ({ onExitAdmin }: AdminHeaderProps) => {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600">Manage FunQuest platform</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={onExitAdmin}
              variant="outline"
              className="font-medium py-2 px-4 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Admin
            </Button>
            
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-900">Admin User</p>
              <p className="text-xs text-slate-500">Super Admin</p>
            </div>
            <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
