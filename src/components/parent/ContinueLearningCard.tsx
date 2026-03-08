import React from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ContinueLearningCardProps {
  lastLetter?: string;
  completedLetters: number;
  childId?: string | null;
}

const ContinueLearningCard = ({ lastLetter, completedLetters, childId }: ContinueLearningCardProps) => {
  const navigate = useNavigate();

  const nextLetter = (() => {
    if (completedLetters >= 26) return null;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // Suggest next unfinished letter
    if (lastLetter) {
      const idx = alphabet.indexOf(lastLetter.toUpperCase());
      if (idx >= 0 && idx < 25) return alphabet[idx + 1];
    }
    return alphabet[completedLetters] || 'A';
  })();

  if (completedLetters >= 26) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-gradient-to-r from-emerald-500 to-sky-500 rounded-3xl p-6 shadow-lg text-white"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
            🎉
          </div>
          <div>
            <h3 className="text-lg font-bold">All Letters Mastered!</h3>
            <p className="text-sm text-white/80">Incredible achievement — time for numbers!</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-6 shadow-lg text-white"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-bold">{nextLetter}</span>
          </div>
          <div>
            <p className="text-xs text-white/70 font-medium uppercase tracking-wide">Continue Learning</p>
            <h3 className="text-lg font-bold">Letter {nextLetter}</h3>
            <p className="text-sm text-white/80">{completedLetters}/26 letters completed</p>
          </div>
        </div>
        <Button
          onClick={() => navigate('/play')}
          className="bg-white text-sky-600 hover:bg-white/90 rounded-xl font-bold shadow-md"
        >
          <Play className="w-4 h-4 mr-1" />
          Play
        </Button>
      </div>

      {/* Mini progress bar */}
      <div className="mt-4 w-full h-2 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(completedLetters / 26) * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-white rounded-full"
        />
      </div>
    </motion.div>
  );
};

export default ContinueLearningCard;
