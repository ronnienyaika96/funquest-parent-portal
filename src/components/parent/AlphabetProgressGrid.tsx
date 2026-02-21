import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LetterProgress {
  letter: string;
  completed: boolean;
  score: number;
  attempts: number;
}

interface AlphabetProgressGridProps {
  progressData: LetterProgress[];
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const AlphabetProgressGrid = ({ progressData }: AlphabetProgressGridProps) => {
  const getLetterState = (letter: string) => {
    const progress = progressData.find(p => p.letter.toUpperCase() === letter);
    if (!progress) return 'locked';
    if (progress.completed) return 'completed';
    return 'in-progress';
  };

  const getLetterData = (letter: string) => {
    return progressData.find(p => p.letter.toUpperCase() === letter);
  };

  const getTooltipText = (state: string, data?: LetterProgress) => {
    switch (state) {
      case 'completed':
        return `✅ Completed! Score: ${data?.score}%`;
      case 'in-progress':
        return `🔵 Needs practice — ${data?.attempts} attempt${data?.attempts !== 1 ? 's' : ''}`;
      default:
        return '🔒 Not started yet';
    }
  };

  const completedCount = alphabet.filter(l => getLetterState(l) === 'completed').length;
  const inProgressCount = alphabet.filter(l => getLetterState(l) === 'in-progress').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Alphabet Progress</h3>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-emerald-500" /> Completed ({completedCount})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-sky-500" /> In Progress ({inProgressCount})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-gray-200" /> Locked
          </span>
        </div>
      </div>

      <TooltipProvider delayDuration={200}>
        <div className="grid grid-cols-9 sm:grid-cols-13 gap-2">
          {alphabet.map((letter, index) => {
            const state = getLetterState(letter);
            const data = getLetterData(letter);
            return (
              <Tooltip key={letter}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className={`relative w-full aspect-square rounded-xl flex items-center justify-center font-bold text-sm cursor-default transition-all ${
                      state === 'completed'
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                        : state === 'in-progress'
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-200'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {letter}
                    {state === 'completed' && (
                      <Check className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-600 text-white rounded-full p-0.5" />
                    )}
                    {state === 'locked' && (
                      <Lock className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-gray-300" />
                    )}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getTooltipText(state, data)}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </motion.div>
  );
};

export default AlphabetProgressGrid;
