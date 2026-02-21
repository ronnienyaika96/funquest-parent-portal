import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Target, Star, Clock, TrendingUp, Flame, Gamepad2 } from 'lucide-react';
import AlphabetProgressGrid from './AlphabetProgressGrid';
import ActivityBreakdownTabs from './ActivityBreakdownTabs';
import AchievementsPanel from './AchievementsPanel';

interface ProgressItem {
  id: string;
  letter: string;
  score: number;
  attempts: number;
  completed: boolean;
  last_traced: string;
}

interface ProgressStatsProps {
  childId?: string | null;
  childName?: string;
}

const ProgressStats = ({ childId, childName }: ProgressStatsProps) => {
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['tracing-progress-stats', childId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await (supabase as any)
        .from('tracing_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('letter', { ascending: true });

      if (error) throw error;
      return (data || []) as ProgressItem[];
    }
  });

  const completedLetters = progressData?.filter(p => p.completed).length || 0;
  const avgScore = progressData?.length
    ? Math.round(progressData.reduce((sum, p) => sum + p.score, 0) / progressData.length)
    : 0;
  const totalAttempts = progressData?.reduce((sum, p) => sum + p.attempts, 0) || 0;
  const lastActivity = progressData?.sort((a, b) => 
    new Date(b.last_traced).getTime() - new Date(a.last_traced).getTime()
  )[0];

  // Simple streak calculation (consecutive days)
  const currentStreak = (() => {
    if (!progressData || progressData.length === 0) return 0;
    const dates = [...new Set(progressData.map(p => 
      new Date(p.last_traced).toDateString()
    ))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < dates.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      if (new Date(dates[i]).toDateString() === expected.toDateString()) {
        streak++;
      } else break;
    }
    return streak;
  })();

  const statCards = [
    { label: 'Letters Learned', value: `${completedLetters}/26`, icon: Target, color: 'bg-sky-100 text-sky-600', emoji: '🔤' },
    { label: 'Numbers Done', value: '0/10', icon: Star, color: 'bg-emerald-100 text-emerald-600', emoji: '🔢' },
    { label: 'Practice Sessions', value: totalAttempts, icon: Clock, color: 'bg-purple-100 text-purple-600', emoji: '📚' },
    { label: 'Current Streak', value: `${currentStreak} day${currentStreak !== 1 ? 's' : ''}`, icon: Flame, color: 'bg-orange-100 text-orange-600', emoji: '🔥' },
    { label: 'Average Score', value: `${avgScore}%`, icon: TrendingUp, color: 'bg-amber-100 text-amber-600', emoji: '⭐' },
    { label: 'Last Activity', value: lastActivity ? `Letter ${lastActivity.letter.toUpperCase()}` : 'None', icon: Gamepad2, color: 'bg-pink-100 text-pink-600', emoji: '🎮' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <span className="text-lg">{stat.emoji}</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={String(stat.value)}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-2xl font-bold text-gray-800"
              >
                {stat.value}
              </motion.p>
            </AnimatePresence>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Encouraging micro-copy */}
      {completedLetters > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-2xl px-5 py-3 border border-sky-100"
        >
          <p className="text-sm text-gray-700 font-medium">
            {completedLetters < 5
              ? `🌱 Great start! ${childName || 'Your child'} is building a strong foundation!`
              : completedLetters < 13
              ? `🚀 Awesome progress! Almost halfway through the alphabet!`
              : completedLetters < 26
              ? `🔥 Incredible! ${childName || 'Your child'} is an alphabet superstar!`
              : `🎉 WOW! The entire alphabet is mastered! Time to celebrate!`}
          </p>
        </motion.div>
      )}

      {/* Alphabet Progress Grid */}
      <AlphabetProgressGrid progressData={progressData || []} />

      {/* Activity Breakdown */}
      <ActivityBreakdownTabs
        lettersCompleted={completedLetters}
        totalLetters={26}
        numbersCompleted={0}
        totalNumbers={10}
      />

      {/* Achievements */}
      <AchievementsPanel
        completedLetters={completedLetters}
        totalAttempts={totalAttempts}
        currentStreak={currentStreak}
        childName={childName}
      />

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
        {progressData && progressData.length > 0 ? (
          <div className="space-y-3">
            {progressData.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                    item.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-sky-100 text-sky-600'
                  }`}>
                    {item.letter.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Letter {item.letter.toUpperCase()}</p>
                    <p className="text-xs text-gray-500">{item.attempts} attempts</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{item.score}%</p>
                  {item.completed && (
                    <span className="text-xs text-emerald-500 font-medium">✓ Completed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No learning data yet</p>
            <p className="text-sm">Start playing games to track progress!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProgressStats;
