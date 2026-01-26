
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Lock, CheckCircle, Trophy } from 'lucide-react';

interface Level {
  id: number;
  title: string;
  emoji: string;
  status: 'completed' | 'current' | 'locked';
  stars: number;
}

interface LearningPathMapProps {
  isOpen: boolean;
  onClose: () => void;
  onLevelClick?: (levelId: number) => void;
}

const levels: Level[] = [
  { id: 1, title: 'ABC Basics', emoji: '🔤', status: 'completed', stars: 3 },
  { id: 2, title: 'Letter Sounds', emoji: '🔊', status: 'completed', stars: 3 },
  { id: 3, title: 'Trace Letters', emoji: '✏️', status: 'completed', stars: 2 },
  { id: 4, title: 'First Words', emoji: '📖', status: 'current', stars: 0 },
  { id: 5, title: 'Number Fun', emoji: '🔢', status: 'locked', stars: 0 },
  { id: 6, title: 'Count & Match', emoji: '🎯', status: 'locked', stars: 0 },
  { id: 7, title: 'Colors & Shapes', emoji: '🎨', status: 'locked', stars: 0 },
  { id: 8, title: 'Animal Words', emoji: '🦁', status: 'locked', stars: 0 },
  { id: 9, title: 'Story Time', emoji: '📚', status: 'locked', stars: 0 },
  { id: 10, title: 'Super Reader!', emoji: '🏆', status: 'locked', stars: 0 },
];

const LearningPathMap = ({ isOpen, onClose, onLevelClick }: LearningPathMapProps) => {
  const getLevelColor = (status: Level['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-yellow-400 animate-pulse';
      case 'locked': return 'bg-gray-300';
    }
  };

  const getPathPosition = (index: number) => {
    // Zigzag pattern
    const isLeft = index % 2 === 0;
    return isLeft ? 'ml-8 sm:ml-16' : 'mr-8 sm:mr-16 ml-auto';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-green-400 z-50 overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="fixed top-4 right-4 z-50 bg-white/90 rounded-full p-3 shadow-lg hover:bg-white transition-colors"
          >
            <span className="text-2xl">✕</span>
          </button>

          {/* Header */}
          <div className="pt-6 pb-4 text-center">
            <motion.h1 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg"
            >
              🗺️ Learning Adventure Map
            </motion.h1>
            <p className="text-white/90 mt-2 text-lg">Complete levels to unlock new adventures!</p>
          </div>

          {/* Path Container */}
          <div className="relative max-w-md mx-auto px-4 pb-20">
            {/* Connecting Path Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-4 bg-white/30 rounded-full -translate-x-1/2" />

            {/* Levels */}
            <div className="relative space-y-6">
              {levels.map((level, index) => (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative ${getPathPosition(index)}`}
                >
                  <motion.button
                    whileHover={level.status !== 'locked' ? { scale: 1.1 } : {}}
                    whileTap={level.status !== 'locked' ? { scale: 0.95 } : {}}
                    onClick={() => level.status !== 'locked' && onLevelClick?.(level.id)}
                    disabled={level.status === 'locked'}
                    className={`
                      relative w-24 h-24 sm:w-28 sm:h-28 rounded-full ${getLevelColor(level.status)}
                      flex flex-col items-center justify-center shadow-xl
                      ${level.status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}
                      ${level.status === 'current' ? 'ring-4 ring-yellow-200 ring-offset-2' : ''}
                    `}
                  >
                    {level.status === 'locked' ? (
                      <Lock className="w-8 h-8 text-gray-500" />
                    ) : (
                      <>
                        <span className="text-3xl sm:text-4xl">{level.emoji}</span>
                        {level.status === 'completed' && (
                          <CheckCircle className="absolute -top-1 -right-1 w-6 h-6 text-white bg-green-600 rounded-full" />
                        )}
                      </>
                    )}
                  </motion.button>

                  {/* Level Info */}
                  <div className={`absolute top-1/2 -translate-y-1/2 ${index % 2 === 0 ? 'left-28 sm:left-32' : 'right-28 sm:right-32 text-right'}`}>
                    <p className="font-bold text-white text-lg drop-shadow-md whitespace-nowrap">
                      {level.title}
                    </p>
                    {level.status !== 'locked' && (
                      <div className={`flex gap-1 ${index % 2 !== 0 ? 'justify-end' : ''}`}>
                        {[1, 2, 3].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= level.stars 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Trophy at the end */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex justify-center pt-8"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LearningPathMap;
