
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import DashboardHeader from '../components/DashboardHeader';
import QuickStats from '../components/QuickStats';
import LearningProgress from '../components/LearningProgress';
import OrdersSection from '../components/OrdersSection';
import PrintablesSection from '../components/PrintablesSection';
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
        return <div className="p-4"><p>Children section for mobile - content here</p></div>;
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
            
            {/* Main Play Games CTA - Center of attention */}
            <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-3xl p-12 text-white text-center shadow-2xl">
              <div className="max-w-3xl mx-auto">
                <div className="text-8xl mb-6">🎮</div>
                <h2 className="text-5xl font-bold mb-6">Ready for Fun Learning?</h2>
                <p className="text-2xl mb-10 text-white/90">Dive into educational games that make learning an adventure!</p>
                <button 
                  onClick={() => setIsGamingMode(true)}
                  className="bg-white text-gray-800 hover:bg-gray-100 px-16 py-8 rounded-3xl text-3xl font-bold shadow-2xl transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <div className="flex items-center justify-center space-x-4">
                    <span>🚀</span>
                    <span>Start Playing Now</span>
                    <span>🎯</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 max-w-4xl mx-auto">
              <LearningProgress preview={true} />
            </div>
          </div>
        );
      case '/children':
        return <div className="space-y-6"><h2 className="text-2xl font-bold">Children Profiles</h2><p>Children management content here</p></div>;
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
            
            {/* Main Play Games CTA - Center of attention */}
            <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-3xl p-12 text-white text-center shadow-2xl">
              <div className="max-w-3xl mx-auto">
                <div className="text-8xl mb-6">🎮</div>
                <h2 className="text-5xl font-bold mb-6">Ready for Fun Learning?</h2>
                <p className="text-2xl mb-10 text-white/90">Dive into educational games that make learning an adventure!</p>
                <button 
                  onClick={() => setIsGamingMode(true)}
                  className="bg-white text-gray-800 hover:bg-gray-100 px-16 py-8 rounded-3xl text-3xl font-bold shadow-2xl transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <div className="flex items-center justify-center space-x-4">
                    <span>🚀</span>
                    <span>Start Playing Now</span>
                    <span>🎯</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 max-w-4xl mx-auto">
              <LearningProgress preview={true} />
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
