
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import DashboardHeader from '../components/DashboardHeader';
import QuickStats from '../components/QuickStats';
import LearningProgress from '../components/LearningProgress';
import ChildProfiles from '../components/ChildProfiles';
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
import { Card, CardContent } from '@/components/ui/card';
import { Play, BookOpen, Trophy, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        return (
          <div className="space-y-8">
            <QuickStats />
            
            {/* Redesigned Dashboard Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Games Section - Medium sized */}
              <Card className="lg:col-span-2 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-4xl">🎮</div>
                        <div>
                          <h2 className="text-2xl font-bold">Ready for Fun Learning?</h2>
                          <p className="text-blue-100">Educational games that make learning an adventure!</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setIsGamingMode(true)}
                        className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-xl font-bold shadow-lg transform transition-all duration-200 hover:scale-105"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start Playing Now
                      </Button>
                    </div>
                    <div className="text-6xl opacity-30">🚀</div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white shadow-lg border-0">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-green-50 border-green-200"
                      onClick={() => setIsGamingMode(true)}
                    >
                      <Play className="w-4 h-4 mr-3 text-green-600" />
                      Play Games
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-blue-50 border-blue-200"
                    >
                      <BookOpen className="w-4 h-4 mr-3 text-blue-600" />
                      Browse Books
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-purple-50 border-purple-200"
                    >
                      <Trophy className="w-4 h-4 mr-3 text-purple-600" />
                      View Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievement Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <h3 className="font-bold text-gray-900">Weekly Star</h3>
                  <p className="text-sm text-gray-600">Emma earned 25 stars this week!</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <h3 className="font-bold text-gray-900">Achievement</h3>
                  <p className="text-sm text-gray-600">Reading Champion unlocked!</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">📚</div>
                  <h3 className="font-bold text-gray-900">Learning Streak</h3>
                  <p className="text-sm text-gray-600">5 days in a row!</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Learning Progress */}
            <div className="max-w-4xl mx-auto">
              <LearningProgress preview={true} />
            </div>
          </div>
        );
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
        return (
          <div className="space-y-8">
            <QuickStats />
            
            {/* Redesigned Dashboard Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Games Section - Medium sized */}
              <Card className="lg:col-span-2 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-4xl">🎮</div>
                        <div>
                          <h2 className="text-2xl font-bold">Ready for Fun Learning?</h2>
                          <p className="text-blue-100">Educational games that make learning an adventure!</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setIsGamingMode(true)}
                        className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-xl font-bold shadow-lg transform transition-all duration-200 hover:scale-105"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start Playing Now
                      </Button>
                    </div>
                    <div className="text-6xl opacity-30">🚀</div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white shadow-lg border-0">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-green-50 border-green-200"
                      onClick={() => setIsGamingMode(true)}
                    >
                      <Play className="w-4 h-4 mr-3 text-green-600" />
                      Play Games
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-blue-50 border-blue-200"
                    >
                      <BookOpen className="w-4 h-4 mr-3 text-blue-600" />
                      Browse Books
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-purple-50 border-purple-200"
                    >
                      <Trophy className="w-4 h-4 mr-3 text-purple-600" />
                      View Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievement Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <h3 className="font-bold text-gray-900">Weekly Star</h3>
                  <p className="text-sm text-gray-600">Emma earned 25 stars this week!</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <h3 className="font-bold text-gray-900">Achievement</h3>
                  <p className="text-sm text-gray-600">Reading Champion unlocked!</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">📚</div>
                  <h3 className="font-bold text-gray-900">Learning Streak</h3>
                  <p className="text-sm text-gray-600">5 days in a row!</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Learning Progress */}
            <div className="max-w-4xl mx-auto">
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
