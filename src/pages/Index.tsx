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
            
            {/* Main Play Games CTA */}
            <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-3xl p-8 text-white text-center shadow-2xl">
              <div className="max-w-2xl mx-auto">
                <div className="text-6xl mb-4">🎮</div>
                <h2 className="text-4xl font-bold mb-4">Ready for Fun Learning?</h2>
                <p className="text-xl mb-8 text-white/90">Dive into educational games that make learning an adventure!</p>
                <button 
                  onClick={() => setIsGamingMode(true)}
                  className="bg-white text-gray-800 hover:bg-gray-100 px-12 py-6 rounded-2xl text-2xl font-bold shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span>🚀</span>
                    <span>Start Playing</span>
                    <span>🎯</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <ChildProfiles preview={true} />
                <LearningProgress preview={true} />
              </div>
              <div className="space-y-8">
                {/* Removed NotificationsPanel */}
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
            
            {/* Main Play Games CTA */}
            <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-3xl p-8 text-white text-center shadow-2xl">
              <div className="max-w-2xl mx-auto">
                <div className="text-6xl mb-4">🎮</div>
                <h2 className="text-4xl font-bold mb-4">Ready for Fun Learning?</h2>
                <p className="text-xl mb-8 text-white/90">Dive into educational games that make learning an adventure!</p>
                <button 
                  onClick={() => setIsGamingMode(true)}
                  className="bg-white text-gray-800 hover:bg-gray-100 px-12 py-6 rounded-2xl text-2xl font-bold shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span>🚀</span>
                    <span>Start Playing</span>
                    <span>🎯</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <ChildProfiles preview={true} />
                <LearningProgress preview={true} />
              </div>
              <div className="space-y-8">
                {/* Removed NotificationsPanel */}
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
          <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
            {renderDesktopContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
