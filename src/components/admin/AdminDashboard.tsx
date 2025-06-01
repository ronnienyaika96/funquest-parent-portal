
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminOverview from './AdminOverview';
import UserManagement from './UserManagement';
import GamesManager from './GamesManager';
import BookManagement from './BookManagement';
import SubscriptionManager from './SubscriptionManager';
import ContentUpload from './ContentUpload';
import Analytics from './Analytics';

const AdminDashboard = ({ onExitAdmin }: { onExitAdmin: () => void }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <UserManagement />;
      case 'games':
        return <GamesManager />;
      case 'books':
        return <BookManagement />;
      case 'subscriptions':
        return <SubscriptionManager />;
      case 'content':
        return <ContentUpload />;
      case 'analytics':
        return <Analytics />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <main className="flex-1">
          <AdminHeader onExitAdmin={onExitAdmin} />
          
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
