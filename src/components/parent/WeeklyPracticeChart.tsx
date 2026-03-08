import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface ProgressItem {
  last_traced: string;
  attempts: number;
}

interface WeeklyPracticeChartProps {
  progressData: ProgressItem[];
}

const WeeklyPracticeChart = ({ progressData }: WeeklyPracticeChartProps) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Build last 7 days activity map
  const weekData = days.map((label, i) => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + mondayOffset + i);
    const dateStr = targetDate.toDateString();

    const sessionsOnDay = progressData.filter(p => {
      try {
        return new Date(p.last_traced).toDateString() === dateStr;
      } catch { return false; }
    });

    const totalAttempts = sessionsOnDay.reduce((sum, s) => sum + (s.attempts || 0), 0);
    const isToday = dateStr === now.toDateString();
    const isPast = targetDate < now && !isToday;

    return { label, attempts: totalAttempts, isToday, isPast, date: targetDate };
  });

  const maxAttempts = Math.max(...weekData.map(d => d.attempts), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Weekly Practice</h3>
          <p className="text-sm text-gray-500">This week's activity</p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 h-32">
        {weekData.map((day, i) => {
          const height = day.attempts > 0 ? Math.max((day.attempts / maxAttempts) * 100, 12) : 4;
          return (
            <div key={day.label} className="flex flex-col items-center gap-2 flex-1">
              {day.attempts > 0 && (
                <span className="text-xs font-bold text-gray-600">{day.attempts}</span>
              )}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
                className={`w-full max-w-[32px] rounded-xl transition-colors ${
                  day.isToday
                    ? 'bg-gradient-to-t from-sky-500 to-sky-400 shadow-md shadow-sky-200'
                    : day.attempts > 0
                    ? 'bg-sky-200'
                    : day.isPast
                    ? 'bg-gray-100'
                    : 'bg-gray-50'
                }`}
              />
              <span className={`text-xs font-medium ${
                day.isToday ? 'text-sky-600 font-bold' : 'text-gray-400'
              }`}>
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default WeeklyPracticeChart;
