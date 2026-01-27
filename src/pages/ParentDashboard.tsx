import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, BarChart3, Settings, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PricingSection from '@/components/parent/PricingSection';
import ProgressStats from '@/components/parent/ProgressStats';
import SettingsSection from '@/components/parent/SettingsSection';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('progress');

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/play')}
              className="rounded-xl hover:bg-sky-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Parent Dashboard</h1>
                <p className="text-xs text-gray-500">Manage learning & subscription</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="bg-white rounded-2xl p-1.5 shadow-md border border-gray-100 w-full md:w-auto">
            <TabsTrigger
              value="progress"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-sky-500 data-[state=active]:text-white font-medium"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger
              value="pricing"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-sky-500 data-[state=active]:text-white font-medium"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pricing
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-sky-500 data-[state=active]:text-white font-medium"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="progress" className="mt-0">
              <ProgressStats />
            </TabsContent>

            <TabsContent value="pricing" className="mt-0">
              <PricingSection />
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <SettingsSection />
            </TabsContent>
          </motion.div>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-sm">
        <p>© 2024 FunQuest Books. Made with ❤️ for little learners.</p>
      </footer>
    </div>
  );
};

export default ParentDashboard;
