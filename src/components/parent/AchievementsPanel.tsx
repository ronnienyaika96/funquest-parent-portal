import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Heart, Lock } from 'lucide-react';

interface AchievementsPanelProps {
  completedLetters: number;
  totalAttempts: number;
  currentStreak: number;
  childName?: string;
}

const AchievementsPanel = ({ completedLetters, totalAttempts, currentStreak, childName = 'Your child' }: AchievementsPanelProps) => {
  const badges = [
    { name: 'First Letter', icon: '🅰️', earned: completedLetters >= 1, desc: 'Complete first letter', threshold: 1, current: completedLetters, unit: 'letter' },
    { name: 'Five Star', icon: '⭐', earned: completedLetters >= 5, desc: 'Complete 5 letters', threshold: 5, current: completedLetters, unit: 'letters' },
    { name: 'Half Way', icon: '🏆', earned: completedLetters >= 13, desc: 'Complete half the alphabet', threshold: 13, current: completedLetters, unit: 'letters' },
    { name: 'Alphabet Pro', icon: '🎓', earned: completedLetters >= 26, desc: 'Master all letters', threshold: 26, current: completedLetters, unit: 'letters' },
    { name: 'Practice Pro', icon: '💪', earned: totalAttempts >= 50, desc: '50 practice sessions', threshold: 50, current: totalAttempts, unit: 'sessions' },
    { name: 'Hot Streak', icon: '🔥', earned: currentStreak >= 3, desc: '3-day streak', threshold: 3, current: currentStreak, unit: 'days' },
  ];

  const earnedCount = badges.filter(b => b.earned).length;
  const starsCollected = completedLetters * 3 + totalAttempts;

  const messages = [];
  if (currentStreak >= 3) messages.push(`Amazing! ${childName} practiced ${currentStreak} days in a row 🎉`);
  if (completedLetters >= 5) messages.push(`${childName} has mastered ${completedLetters} letters! Keep going! 🌟`);
  if (totalAttempts >= 10) messages.push(`${childName} is building great learning habits! 💪`);
  if (messages.length === 0) messages.push(`Every practice session counts. You're doing great! 🌈`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Achievements & Rewards</h3>
          <p className="text-sm text-gray-500">{earnedCount}/{badges.length} badges earned · {starsCollected} ⭐ collected</p>
        </div>
      </div>

      {/* Badges Grid with locked/unlocked states */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
        {badges.map((badge, index) => {
          const progress = badge.earned ? 1 : Math.min(badge.current / badge.threshold, 0.99);
          return (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`relative flex flex-col items-center gap-1 p-3 rounded-2xl text-center transition-all ${
                badge.earned
                  ? 'bg-amber-50 border-2 border-amber-300 shadow-sm'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              {!badge.earned && (
                <div className="absolute top-1 right-1">
                  <Lock className="w-3 h-3 text-gray-300" />
                </div>
              )}
              <span className={`text-2xl ${badge.earned ? '' : 'grayscale opacity-40'}`}>{badge.icon}</span>
              <p className={`text-xs font-medium leading-tight ${badge.earned ? 'text-gray-800' : 'text-gray-400'}`}>
                {badge.name}
              </p>
              {/* Progress indicator for locked badges */}
              {!badge.earned && (
                <div className="w-full mt-1">
                  <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.05 }}
                      className="h-full bg-amber-400 rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">{badge.current}/{badge.threshold}</p>
                </div>
              )}
              {badge.earned && (
                <span className="text-[10px] text-amber-600 font-bold">✓ Earned</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Encouraging Message */}
      <div className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-2xl p-4 border border-sky-100">
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
          <div>
            {messages.map((msg, i) => (
              <p key={i} className="text-sm text-gray-700 font-medium">
                {msg}
              </p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementsPanel;
