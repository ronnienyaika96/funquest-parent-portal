import React from 'react';
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
    { id: 'letters', label: 'Letters', icon: BookOpen, completed: lettersCompleted, total: totalLetters, lastPlayed: lettersCompleted > 0 ? 'Recently' : 'Never', barColor: 'bg-blue-500', bgColor: 'bg-blue-50', dotColor: 'bg-blue-500' },
    { id: 'numbers', label: 'Numbers', icon: Hash, completed: numbersCompleted, total: totalNumbers, lastPlayed: numbersCompleted > 0 ? 'Recently' : 'Never', barColor: 'bg-orange-500', bgColor: 'bg-orange-50', dotColor: 'bg-orange-500' },
    { id: 'games', label: 'Games', icon: Gamepad2, completed: 0, total: 5, lastPlayed: 'Coming soon', barColor: 'bg-purple-500', bgColor: 'bg-purple-50', dotColor: 'bg-purple-500' },
    { id: 'stories', label: 'Stories', icon: BookMarked, completed: 0, total: 3, lastPlayed: 'Coming soon', barColor: 'bg-green-500', bgColor: 'bg-green-50', dotColor: 'bg-green-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-4">Activity Breakdown</h3>

      {/* Color legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {categories.map(cat => (
          <span key={cat.id} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className={`w-2.5 h-2.5 rounded-full ${cat.dotColor}`} />
            {cat.label}
          </span>
        ))}
      </div>
      
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

                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${cat.barColor}`}
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
