import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Flame, Award, Heart } from 'lucide-react';

interface AchievementsPanelProps {
  completedLetters: number;
  totalAttempts: number;
  currentStreak: number;
  childName?: string;
}

const AchievementsPanel = ({ completedLetters, totalAttempts, currentStreak, childName = 'Your child' }: AchievementsPanelProps) => {
  const badges = [
    { name: 'First Letter', icon: '🅰️', earned: completedLetters >= 1, desc: 'Completed first letter' },
    { name: 'Five Star', icon: '⭐', earned: completedLetters >= 5, desc: 'Completed 5 letters' },
    { name: 'Half Way', icon: '🏆', earned: completedLetters >= 13, desc: 'Completed half the alphabet' },
    { name: 'Alphabet Pro', icon: '🎓', earned: completedLetters >= 26, desc: 'Mastered all letters' },
    { name: 'Practice Pro', icon: '💪', earned: totalAttempts >= 50, desc: '50 practice sessions' },
    { name: 'Hot Streak', icon: '🔥', earned: currentStreak >= 3, desc: '3-day streak' },
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
          <p className="text-sm text-gray-500">{earnedCount} badges earned · {starsCollected} ⭐ collected</p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl text-center ${
              badge.earned
                ? 'bg-amber-50 border border-amber-200'
                : 'bg-gray-50 border border-gray-100 opacity-50'
            }`}
          >
            <span className="text-2xl">{badge.icon}</span>
            <p className="text-xs font-medium text-gray-700 leading-tight">{badge.name}</p>
          </motion.div>
        ))}
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
