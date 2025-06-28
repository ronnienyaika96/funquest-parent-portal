
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

const sidebarItems = [
  { title: 'Dashboard', url: '/dashboard', icon: '🏠', color: 'text-blue-600' },
  { title: 'My Children', url: '/children', icon: '👧👦', color: 'text-purple-600' },
  { title: 'Learning Progress', url: '/progress', icon: '📊', color: 'text-green-600' },
  { title: 'Shop', url: '/shop', icon: '🛒', color: 'text-orange-600' },
  { title: 'My Orders', url: '/orders', icon: '📦', color: 'text-blue-600' },
  { title: 'Subscriptions', url: '/subscriptions', icon: '💳', color: 'text-indigo-600' },
  { title: 'Printables', url: '/printables', icon: '🖨️', color: 'text-teal-600' },
  { title: 'Landing Page', url: '/landing', icon: '🌟', color: 'text-pink-600' },
  { title: 'Notifications', url: '/notifications', icon: '🔔', color: 'text-yellow-600' },
  { title: 'Account Settings', url: '/settings', icon: '⚙️', color: 'text-gray-600' },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/dashboard') return currentPath === '/' || currentPath === '/dashboard';
    return currentPath === path;
  };

  return (
    <Sidebar className="w-72 border-r border-gray-200 bg-white shadow-sm">
      <SidebarContent className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">FunQuest</h1>
          <p className="text-sm text-gray-500">Learning Dashboard</p>
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url === '/dashboard' ? '/' : item.url}
                      className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200 font-medium text-base ${
                        isActive(item.url)
                          ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-semibold">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
