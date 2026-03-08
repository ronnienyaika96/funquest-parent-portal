import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Clock, Zap } from 'lucide-react';

interface LearningInsightsProps {
  completedLetters: number;
  totalAttempts: number;
  avgScore: number;
  currentStreak: number;
  childName?: string;
}

const LearningInsights = ({ completedLetters, totalAttempts, avgScore, currentStreak, childName = 'Your child' }: LearningInsightsProps) => {
  const insights = [];

  if (avgScore >= 80) {
    insights.push({ icon: '🎯', text: `${childName} is performing above average with ${avgScore}% accuracy!`, type: 'positive' });
  } else if (avgScore >= 50) {
    insights.push({ icon: '📈', text: `${childName}'s accuracy is ${avgScore}%. More practice will boost scores!`, type: 'neutral' });
  } else if (totalAttempts > 0) {
    insights.push({ icon: '💡', text: `${childName} is still learning — keep encouraging practice sessions.`, type: 'encourage' });
  }

  if (currentStreak >= 5) {
    insights.push({ icon: '🔥', text: `Incredible ${currentStreak}-day streak! Consistency builds mastery.`, type: 'positive' });
  } else if (currentStreak >= 2) {
    insights.push({ icon: '✨', text: `${currentStreak}-day streak going! Keep the momentum alive.`, type: 'neutral' });
  } else {
    insights.push({ icon: '🌱', text: 'Try practicing daily — even 5 minutes builds strong habits.', type: 'encourage' });
  }

  if (completedLetters >= 20) {
    insights.push({ icon: '🏆', text: `Almost there! Only ${26 - completedLetters} letters left to master.`, type: 'positive' });
  } else if (completedLetters >= 10) {
    insights.push({ icon: '🚀', text: `Great progress on letters! ${completedLetters}/26 mastered so far.`, type: 'neutral' });
  }

  const strengthArea = avgScore >= 70 ? 'Letter Recognition' : 'Tracing Practice';
  const focusArea = completedLetters < 13 ? 'Alphabet Completion' : 'Number Practice';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Learning Insights</h3>
          <p className="text-sm text-gray-500">Performance summary for {childName}</p>
        </div>
      </div>

      {/* Strength & Focus Areas */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Strength</span>
          </div>
          <p className="text-sm font-bold text-gray-800">{strengthArea}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Focus Area</span>
          </div>
          <p className="text-sm font-bold text-gray-800">{focusArea}</p>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className={`flex items-start gap-3 p-3 rounded-xl border ${
              insight.type === 'positive' ? 'bg-emerald-50 border-emerald-100' :
              insight.type === 'neutral' ? 'bg-sky-50 border-sky-100' :
              'bg-amber-50 border-amber-100'
            }`}
          >
            <span className="text-lg flex-shrink-0">{insight.icon}</span>
            <p className="text-sm text-gray-700 font-medium">{insight.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LearningInsights;
