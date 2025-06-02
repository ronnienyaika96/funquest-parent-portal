
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminOverview } from '../components/admin/AdminOverview';
import { ParentChildManager } from '../components/admin/ParentChildManager';
import { GamesManager } from '../components/admin/GamesManager';
import { BookEcommerceManager } from '../components/admin/BookEcommerceManager';
import { SubscriptionsManager } from '../components/admin/SubscriptionsManager';
import { ContentUploadPanel } from '../components/admin/ContentUploadPanel';
import { NewsletterCRM } from '../components/admin/NewsletterCRM';
import { AnalyticsLogs } from '../components/admin/AnalyticsLogs';
import { useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const renderContent = () => {
    switch (currentPath) {
      case '/admin':
      case '/admin/dashboard':
        return <AdminOverview />;
      case '/admin/users':
        return <ParentChildManager />;
      case '/admin/games':
        return <GamesManager />;
      case '/admin/books':
        return <BookEcommerceManager />;
      case '/admin/subscriptions':
        return <SubscriptionsManager />;
      case '/admin/content':
        return <ContentUploadPanel />;
      case '/admin/newsletter':
        return <NewsletterCRM />;
      case '/admin/analytics':
        return <AnalyticsLogs />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
