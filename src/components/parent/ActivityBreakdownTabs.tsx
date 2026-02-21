import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Hash, Gamepad2, BookMarked, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityBreakdownTabsProps {
  lettersCompleted: number;
  totalLetters: number;
  numbersCompleted: number;
  totalNumbers: number;
}

const ActivityBreakdownTabs = ({ lettersCompleted, totalLetters, numbersCompleted, totalNumbers }: ActivityBreakdownTabsProps) => {
  const categories = [
    {
      id: 'letters',
      label: 'Letters',
      icon: BookOpen,
      completed: lettersCompleted,
      total: totalLetters,
      lastPlayed: lettersCompleted > 0 ? 'Recently' : 'Never',
      color: 'sky'
    },
    {
      id: 'numbers',
      label: 'Numbers',
      icon: Hash,
      completed: numbersCompleted,
      total: totalNumbers,
      lastPlayed: numbersCompleted > 0 ? 'Recently' : 'Never',
      color: 'emerald'
    },
    {
      id: 'games',
      label: 'Games',
      icon: Gamepad2,
      completed: 0,
      total: 5,
      lastPlayed: 'Coming soon',
      color: 'purple'
    },
    {
      id: 'stories',
      label: 'Stories',
      icon: BookMarked,
      completed: 0,
      total: 3,
      lastPlayed: 'Coming soon',
      color: 'amber'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-4">Activity Breakdown</h3>
      
      <Tabs defaultValue="letters">
        <TabsList className="bg-gray-100 rounded-xl p-1 w-full">
          {categories.map(cat => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="rounded-lg flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
            >
              <cat.icon className="w-4 h-4 mr-1" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(cat => {
          const pct = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
          return (
            <TabsContent key={cat.id} value={cat.id} className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{pct}%</p>
                    <p className="text-sm text-gray-500">{cat.completed} of {cat.total} completed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Last played</p>
                    <p className="text-sm font-medium text-gray-700">{cat.lastPlayed}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      cat.color === 'sky' ? 'bg-sky-500' :
                      cat.color === 'emerald' ? 'bg-emerald-500' :
                      cat.color === 'purple' ? 'bg-purple-500' :
                      'bg-amber-500'
                    }`}
                  />
                </div>

                <Button
                  variant="outline"
                  className="rounded-xl w-full"
                  disabled={cat.id === 'games' || cat.id === 'stories'}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {cat.id === 'games' || cat.id === 'stories' ? 'Coming Soon' : 'Practice Again'}
                </Button>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </motion.div>
  );
};

export default ActivityBreakdownTabs;
