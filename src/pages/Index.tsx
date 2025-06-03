import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import DashboardHeader from '../components/DashboardHeader';
import QuickStats from '../components/QuickStats';
import ChildProfiles from '../components/ChildProfiles';
import LearningProgress from '../components/LearningProgress';
import OrdersSection from '../components/OrdersSection';
import PrintablesSection from '../components/PrintablesSection';
import SubscriptionCard from '../components/SubscriptionCard';
import { EnhancedSubscriptionCard } from '../components/enhanced/EnhancedSubscriptionCard';
import NotificationsPanel from '../components/NotificationsPanel';
import AccountSettings from '../components/AccountSettings';
import ShopInterface from '../components/shop/ShopInterface';
import GamingInterface from '../components/gaming/GamingInterface';
import { useLocation } from 'react-router-dom';
import MobileBottomNav from '../components/mobile/MobileBottomNav';
import MobileHeader from '../components/mobile/MobileHeader';
import MobileDashboard from '../components/mobile/MobileDashboard';
import MobileGamesInterface from '../components/mobile/MobileGamesInterface';
import { useIsMobile } from '../hooks/use-mobile';

const Index = () => {
  const [isGamingMode, setIsGamingMode] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const currentPath = location.pathname;

  if (isGamingMode) {
    return <GamingInterface onExitGaming={() => setIsGamingMode(false)} />;
  }

  const renderMobileContent = () => {
    switch (currentPath) {
      case '/':
      case '/dashboard':
        return <MobileDashboard />;
      case '/games':
        return <MobileGamesInterface />;
      case '/children':
        return <ChildProfiles preview={false} />;
      case '/progress':
        return <LearningProgress preview={false} />;
      case '/shop':
        return <ShopInterface />;
      case '/orders':
        return <OrdersSection />;
      case '/subscriptions':
        return <EnhancedSubscriptionCard />;
      case '/printables':
        return <PrintablesSection />;
      case '/notifications':
        return <NotificationsPanel />;
      case '/settings':
        return <AccountSettings />;
      default:
        return <MobileDashboard />;
    }
  };

  const renderDesktopContent = () => {
    switch (currentPath) {
      case '/':
      case '/dashboard':
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
                <NotificationsPanel />
              </div>
            </div>
          </div>
        );
      case '/children':
        return <ChildProfiles preview={false} />;
      case '/progress':
        return <LearningProgress preview={false} />;
      case '/shop':
        return <ShopInterface />;
      case '/orders':
        return <OrdersSection />;
      case '/subscriptions':
        return <EnhancedSubscriptionCard />;
      case '/printables':
        return <PrintablesSection />;
      case '/notifications':
        return <NotificationsPanel />;
      case '/settings':
        return <AccountSettings />;
      default:
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
                <NotificationsPanel />
              </div>
            </div>
          </div>
        );
    }
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader 
          title="FunQuest"
          showSearch={currentPath === '/shop' || currentPath === '/games'}
          showNotifications={true}
        />
        <main className="bg-gray-50">
          {renderMobileContent()}
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  // Desktop Layout (existing)
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <DashboardHeader onEnterGamingMode={() => setIsGamingMode(true)} />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderDesktopContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
