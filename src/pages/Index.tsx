
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import DashboardHeader from '../components/DashboardHeader';
import ChildProfiles from '../components/ChildProfiles';
import OrdersSection from '../components/OrdersSection';
import PrintablesSection from '../components/PrintablesSection';
import { EnhancedSubscriptionCard } from '../components/enhanced/EnhancedSubscriptionCard';
import NotificationsPanel from '../components/NotificationsPanel';
import AccountSettings from '../components/AccountSettings';
import ShopInterface from '../components/shop/ShopInterface';
import GamingInterface from '../components/gaming/GamingInterface';
import LearningProgress from '../components/LearningProgress';
import DashboardContent from '../components/dashboard/DashboardContent';
import { useLocation } from 'react-router-dom';
import MobileBottomNav from '../components/mobile/MobileBottomNav';
import MobileHeader from '../components/mobile/MobileHeader';
import MobileDashboard from '../components/mobile/MobileDashboard';
import MobileGamesInterface from '../components/mobile/MobileGamesInterface';
import { useIsMobile } from '../hooks/use-mobile';

const Index = () => {
  const [isGamingMode, setIsGamingMode] = useState(false);
  const [activeGame, setActiveGame] = useState<string>('');
  const isMobile = useIsMobile();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Handle mobile game redirects
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const startGame = urlParams.get('startGame');
    if (startGame === 'tracing' || startGame === 'coloring') {
      setIsGamingMode(true);
      setActiveGame(startGame);
    }
  }, []);

  if (isGamingMode) {
    return <GamingInterface 
      onExitGaming={() => {
        setIsGamingMode(false);
        setActiveGame('');
        // Clear URL params when exiting gaming mode
        if (window.location.search.includes('startGame')) {
          window.history.replaceState({}, '', window.location.pathname);
        }
      }}
      initialGame={activeGame}
    />;
  }

  const renderMobileContent = () => {
    switch (currentPath) {
      case '/':
      case '/dashboard':
        return <MobileDashboard />;
      case '/games':
        return <MobileGamesInterface />;
      case '/children':
        return <ChildProfiles />;
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
        return <DashboardContent onStartGaming={() => setIsGamingMode(true)} />;
      case '/children':
        return <ChildProfiles />;
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
        return <DashboardContent onStartGaming={() => setIsGamingMode(true)} />;
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

  // Desktop Layout
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <DashboardHeader onEnterGamingMode={() => setIsGamingMode(true)} />
          <main className="max-w-7xl mx-auto px-8 py-8">
            {renderDesktopContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
