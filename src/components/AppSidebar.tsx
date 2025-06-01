
import React from 'react';
import { 
  Home, 
  Users, 
  BarChart3, 
  Package, 
  FileText, 
  Bell, 
  Settings,
  Star
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AppSidebar = ({ activeSection, setActiveSection }: AppSidebarProps) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: Home,
      description: 'Main dashboard view'
    },
    {
      id: 'children',
      label: 'My Children',
      icon: Users,
      description: 'Manage child profiles'
    },
    {
      id: 'progress',
      label: 'Learning Progress',
      icon: BarChart3,
      description: 'Track learning activities'
    },
    {
      id: 'orders',
      label: 'Orders & Subscriptions',
      icon: Package,
      description: 'Manage purchases'
    },
    {
      id: 'printables',
      label: 'Printables',
      icon: FileText,
      description: 'Download materials'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Updates and announcements'
    },
    {
      id: 'settings',
      label: 'Account Settings',
      icon: Settings,
      description: 'Manage your account'
    }
  ];

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
            F
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">FunQuest</h2>
            <p className="text-sm text-slate-500">Parent Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 font-medium">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.id)}
                    isActive={activeSection === item.id}
                    className={`w-full justify-start p-3 rounded-lg transition-colors ${
                      activeSection === item.id 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.description}</div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-slate-600 font-medium flex items-center">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-900 mb-2">Need Help?</h4>
              <p className="text-sm text-orange-700 mb-3">Get support for your account</p>
              <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                Contact Support
              </button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
