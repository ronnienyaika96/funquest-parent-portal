
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '../components/AppSidebar';
import DashboardHeader from '../components/DashboardHeader';
import QuickStats from '../components/QuickStats';
import ChildProfiles from '../components/ChildProfiles';
import LearningProgress from '../components/LearningProgress';
import OrdersSection from '../components/OrdersSection';
import PrintablesSection from '../components/PrintablesSection';
import SubscriptionCard from '../components/SubscriptionCard';
import NotificationsPanel from '../components/NotificationsPanel';
import AccountSettings from '../components/AccountSettings';
import GamingInterface from '../components/gaming/GamingInterface';

const Index = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isGamingMode, setIsGamingMode] = useState(false);

  if (isGamingMode) {
    return <GamingInterface onExitGaming={() => setIsGamingMode(false)} />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <QuickStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <ChildProfiles preview={true} />
                <LearningProgress preview={true} />
              </div>
              <div className="space-y-8">
                <SubscriptionCard />
                <NotificationsPanel preview={true} />
              </div>
            </div>
          </div>
        );
      case 'children':
        return <ChildProfiles preview={false} />;
      case 'progress':
        return <LearningProgress preview={false} />;
      case 'orders':
        return <OrdersSection />;
      case 'printables':
        return <PrintablesSection />;
      case 'notifications':
        return <NotificationsPanel preview={false} />;
      case 'settings':
        return <AccountSettings />;
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <main className="flex-1">
          <DashboardHeader onEnterGamingMode={() => setIsGamingMode(true)} />
          
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
