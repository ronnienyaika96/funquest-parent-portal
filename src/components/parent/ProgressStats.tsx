import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Star, Clock, Target } from 'lucide-react';

interface ProgressItem {
  id: string;
  letter: string;
  score: number;
  attempts: number;
  completed: boolean;
}

const ProgressStats = () => {
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['tracing-progress-stats'],
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

  const chartData = progressData?.slice(0, 10).map(item => ({
    name: item.letter.toUpperCase(),
    score: item.score,
    attempts: item.attempts,
    completed: item.completed
  })) || [];

  const totalLetters = progressData?.length || 0;
  const completedLetters = progressData?.filter(p => p.completed).length || 0;
  const avgScore = progressData?.length 
    ? Math.round(progressData.reduce((sum, p) => sum + p.score, 0) / progressData.length)
    : 0;
  const totalAttempts = progressData?.reduce((sum, p) => sum + p.attempts, 0) || 0;

  const statCards = [
    { label: 'Letters Learned', value: `${completedLetters}/${totalLetters || 26}`, icon: Target, color: 'bg-sky-100 text-sky-600' },
    { label: 'Average Score', value: `${avgScore}%`, icon: Star, color: 'bg-amber-100 text-amber-600' },
    { label: 'Total Practice', value: totalAttempts, icon: Clock, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Progress', value: `${Math.round((completedLetters / 26) * 100)}%`, icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Letter Tracing Progress</h3>
        
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#e5e7eb' }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#e5e7eb' }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                formatter={(value: number, name: string) => [`${value}${name === 'score' ? '%' : ''}`, name === 'score' ? 'Score' : 'Attempts']}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.completed ? '#22c55e' : '#0ea5e9'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400">
            <Target className="w-12 h-12 mb-2" />
            <p>No learning data yet</p>
            <p className="text-sm">Start playing games to track progress!</p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
          <p className="text-center text-gray-400 py-8">No recent activity</p>
        )}
      </motion.div>
    </div>
  );
};

export default ProgressStats;
