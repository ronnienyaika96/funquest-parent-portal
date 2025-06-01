
import React, { useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import QuickStats from '../components/QuickStats';
import ChildProfiles from '../components/ChildProfiles';
import LearningProgress from '../components/LearningProgress';
import OrdersSection from '../components/OrdersSection';
import PrintablesSection from '../components/PrintablesSection';
import SubscriptionCard from '../components/SubscriptionCard';
import NotificationsPanel from '../components/NotificationsPanel';
import GamingInterface from '../components/gaming/GamingInterface';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGamingMode, setIsGamingMode] = useState(false);

  if (isGamingMode) {
    return <GamingInterface onExitGaming={() => setIsGamingMode(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-yellow-50 to-sky-100">
      <DashboardHeader onEnterGamingMode={() => setIsGamingMode(true)} />
      
      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex space-x-1 bg-white rounded-2xl p-2 shadow-lg mb-8">
          {[
            { id: 'overview', label: '🏠 Overview', icon: '🏠' },
            { id: 'children', label: '👧👦 My Kids', icon: '👧👦' },
            { id: 'progress', label: '📊 Progress', icon: '📊' },
            { id: 'orders', label: '📦 Orders', icon: '📦' },
            { id: 'printables', label: '🖨️ Printables', icon: '🖨️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-sky-500 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:bg-sky-50 hover:text-sky-600'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden text-2xl">{tab.icon}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <QuickStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <ChildProfiles preview={true} />
                <LearningProgress preview={true} />
              </div>
              <div className="space-y-8">
                <SubscriptionCard />
                <NotificationsPanel />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'children' && <ChildProfiles preview={false} />}
        {activeTab === 'progress' && <LearningProgress preview={false} />}
        {activeTab === 'orders' && <OrdersSection />}
        {activeTab === 'printables' && <PrintablesSection />}
      </div>
    </div>
  );
};

export default Index;
