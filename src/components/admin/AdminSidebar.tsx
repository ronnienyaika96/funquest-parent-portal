
import React from 'react';
import { 
  BarChart3, 
  Users, 
  Package, 
  Gamepad2, 
  FileText, 
  Settings,
  Upload,
  DollarSign
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

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AdminSidebar = ({ activeSection, setActiveSection }: AdminSidebarProps) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      id: 'games',
      label: 'Games Manager',
      icon: Gamepad2,
      color: 'text-green-600'
    },
    {
      id: 'books',
      label: 'Book Management',
      icon: Package,
      color: 'text-orange-600'
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: DollarSign,
      color: 'text-red-600'
    },
    {
      id: 'content',
      label: 'Content Upload',
      icon: Upload,
      color: 'text-yellow-600'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'text-indigo-600'
    }
  ];

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
            A
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">FunQuest</h2>
            <p className="text-sm text-slate-500">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 font-medium text-lg">Admin Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.id)}
                    isActive={activeSection === item.id}
                    className={`w-full justify-start p-4 rounded-xl transition-colors mb-2 ${
                      activeSection === item.id 
                        ? 'bg-red-50 text-red-700 border-l-4 border-red-600' 
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className={`w-8 h-8 mr-4 ${item.color}`} />
                    <div className="text-left">
                      <div className="font-semibold text-lg">{item.label}</div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
