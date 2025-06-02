
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
import { Shield, BarChart3, Users, Gamepad2, BookOpen, CreditCard, Upload, Mail, TrendingUp } from 'lucide-react';

const adminSidebarItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: BarChart3, color: 'text-blue-600' },
  { title: 'Users & Children', url: '/admin/users', icon: Users, color: 'text-purple-600' },
  { title: 'Games Manager', url: '/admin/games', icon: Gamepad2, color: 'text-green-600' },
  { title: 'Books & Orders', url: '/admin/books', icon: BookOpen, color: 'text-orange-600' },
  { title: 'Subscriptions', url: '/admin/subscriptions', icon: CreditCard, color: 'text-indigo-600' },
  { title: 'Content Upload', url: '/admin/content', icon: Upload, color: 'text-teal-600' },
  { title: 'Newsletter & CRM', url: '/admin/newsletter', icon: Mail, color: 'text-yellow-600' },
  { title: 'Analytics & Logs', url: '/admin/analytics', icon: TrendingUp, color: 'text-red-600' },
];

export function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') return currentPath === '/admin' || currentPath === '/admin/dashboard';
    return currentPath === path;
  };

  return (
    <Sidebar className="w-72 border-r border-gray-200 bg-white shadow-sm">
      <SidebarContent className="p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">FunQuest Admin</h1>
          </div>
          <p className="text-sm text-gray-500">Administrative Dashboard</p>
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {adminSidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url === '/admin/dashboard' ? '/admin' : item.url}
                      className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200 font-medium text-base ${
                        isActive(item.url)
                          ? 'bg-red-50 text-red-700 shadow-sm border border-red-100'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="w-6 h-6" />
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
