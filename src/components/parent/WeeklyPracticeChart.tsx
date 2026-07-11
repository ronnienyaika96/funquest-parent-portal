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

// Treat each attempt as ~1 minute of focused practice for visualization purposes.
const MINUTES_PER_ATTEMPT = 1;
const WEEKLY_GOAL_MINUTES = 15;

const WeeklyPracticeChart = ({ progressData }: WeeklyPracticeChartProps) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const weekData = days.map((label, i) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + mondayOffset + i);
    const dateStr = targetDate.toDateString();

    const sessionsOnDay = progressData.filter(p => {
      try { return new Date(p.last_traced).toDateString() === dateStr; }
      catch { return false; }
    });

    const attempts = sessionsOnDay.reduce((sum, s) => sum + (s.attempts || 0), 0);
    const minutes = attempts * MINUTES_PER_ATTEMPT;
    const isToday = dateStr === now.toDateString();
    const isPast = targetDate < now && !isToday;
    const metGoal = minutes >= WEEKLY_GOAL_MINUTES;

    return { label, minutes, isToday, isPast, metGoal };
  });

  // Chart scale: at least tall enough to show the goal line clearly.
  const maxScale = Math.max(WEEKLY_GOAL_MINUTES * 1.4, ...weekData.map(d => d.minutes));
  const goalPct = (WEEKLY_GOAL_MINUTES / maxScale) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Weekly Practice</h3>
            <p className="text-sm text-gray-500">Practice minutes per day</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Goal 15 min/day
        </div>
      </div>

      {/* Chart area with dashed goal line overlay */}
      <div className="relative h-40 pt-4">
        {/* Dashed goal line */}
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-emerald-300/80 z-10 pointer-events-none"
          style={{ bottom: `calc(28px + ${goalPct}% * 0.75)` }}
        >
          <span className="absolute -top-5 right-0 text-[10px] font-semibold text-emerald-600 bg-white px-1.5 rounded">
            Weekly Goal: 15 mins/day
          </span>
        </div>

        <div className="flex items-end justify-between gap-2 h-full">
          {weekData.map((day, i) => {
            const height = day.minutes > 0
              ? Math.max((day.minutes / maxScale) * 100, 8)
              : 3;
            const barColor = day.metGoal
              ? 'bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-md shadow-emerald-200'
              : day.isToday
              ? 'bg-gradient-to-t from-sky-500 to-sky-400 shadow-md shadow-sky-200'
              : day.minutes > 0
              ? 'bg-sky-200'
              : day.isPast
              ? 'bg-gray-100'
              : 'bg-gray-50';

            return (
              <div key={day.label} className="flex flex-col items-center gap-1.5 flex-1 h-full justify-end">
                {day.minutes > 0 && (
                  <span className={`text-[11px] font-bold ${day.metGoal ? 'text-emerald-600' : 'text-gray-600'}`}>
                    {day.minutes}m
                  </span>
                )}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
                  className={`w-full max-w-[36px] rounded-xl ${barColor}`}
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
      </div>
    </motion.div>
  );
};

export default WeeklyPracticeChart;
