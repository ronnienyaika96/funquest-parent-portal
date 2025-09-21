
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, Users, BarChart3, ShoppingBag, Package, CreditCard, FileText, Bell, Settings, GamepadIcon } from 'lucide-react';

const sidebarItems = [
  { title: 'Home', url: '/dashboard', icon: Home, color: 'text-funquest-blue' },
  { title: 'My Courses', url: '/courses', icon: GamepadIcon, color: 'text-funquest-purple' },
  { title: 'My Children', url: '/children', icon: Users, color: 'text-funquest-pink' },
  { title: 'Progress Reports', url: '/progress', icon: BarChart3, color: 'text-funquest-green' },
  { title: 'Quizzes & Activities', url: '/activities', icon: FileText, color: 'text-funquest-orange' },
  { title: 'Shop', url: '/shop', icon: ShoppingBag, color: 'text-funquest-turquoise' },
  { title: 'My Orders', url: '/orders', icon: Package, color: 'text-funquest-blue' },
  { title: 'Subscriptions', url: '/subscriptions', icon: CreditCard, color: 'text-funquest-purple' },
  { title: 'Community', url: '/community', icon: Users, color: 'text-funquest-pink' },
  { title: 'Notifications', url: '/notifications', icon: Bell, color: 'text-funquest-warning' },
  { title: 'Settings', url: '/settings', icon: Settings, color: 'text-funquest-accent' },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/dashboard') return currentPath === '/' || currentPath === '/dashboard';
    return currentPath === path;
  };

  return (
    <Sidebar className="w-72 border-r-0 bg-gradient-to-br from-sidebar-background to-white shadow-xl">
      <SidebarContent className="p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-funquest-purple to-funquest-pink rounded-2xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">✨</span>
            </div>
            <div>
              <h1 className="text-2xl font-playful font-bold bg-gradient-to-r from-funquest-purple to-funquest-pink bg-clip-text text-transparent">
                FunQuest
              </h1>
              <p className="text-sm text-muted-foreground font-clean">Learning Adventure</p>
            </div>
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url === '/dashboard' ? '/' : item.url}
                      className={`flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-200 font-playful text-base group ${
                        isActive(item.url)
                          ? 'bg-gradient-to-r from-funquest-purple/10 to-funquest-pink/10 text-funquest-purple shadow-lg border border-funquest-purple/20'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-md'
                      }`}
                    >
                      <item.icon className={`h-6 w-6 ${isActive(item.url) ? 'text-funquest-purple' : item.color} transition-colors duration-200`} />
                      <span className="font-semibold">{item.title}</span>
                      {isActive(item.url) && (
                        <div className="ml-auto w-2 h-2 bg-funquest-purple rounded-full animate-pulse"></div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Fun Mascot Section */}
        <div className="mt-8 p-4 bg-gradient-to-br from-funquest-warning/10 to-funquest-orange/10 rounded-2xl border border-funquest-warning/20">
          <div className="text-center">
            <div className="text-4xl mb-2">🦄</div>
            <p className="text-sm font-playful text-funquest-purple font-semibold">
              "Ready for your next adventure?"
            </p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
