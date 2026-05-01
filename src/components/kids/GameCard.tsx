import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface GameCardProps {
  title: string;
  emoji: string;
  color: string;
  progress?: number;
  isNew?: boolean;
  thumbnail?: string;
  onClick?: () => void;
}

const GameCard = ({ title, emoji, color, progress, isNew, thumbnail, onClick }: GameCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -6 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="relative cursor-pointer flex-shrink-0"
    >
      <div
        className={`w-[calc(50vw-2rem)] h-[calc(50vw-0.5rem)] max-w-[240px] max-h-[280px] rounded-3xl shadow-medium flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br ${color}`}
      >
        {/* Soft decorative shapes */}
        <div className="absolute top-5 left-5 w-10 h-10 bg-white/12 rounded-full blur-[1px]" />
        <div className="absolute bottom-8 right-6 w-14 h-14 bg-white/8 rounded-full blur-[1px]" />

        {/* Main emoji */}
        <span className="text-6xl sm:text-7xl mb-2 drop-shadow-lg select-none">{emoji}</span>

        {/* Title */}
        <p className="text-white font-bold text-sm sm:text-base text-center px-4 drop-shadow-md leading-tight">
          {title}
        </p>

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="h-2 bg-white/25 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        )}

        {/* New badge */}
        {isNew && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="absolute top-3 right-3 bg-funquest-warning text-foreground text-2xs font-bold px-2.5 py-1 rounded-full shadow-soft flex items-center gap-1"
          >
            <Star className="w-3 h-3 fill-current" />
            NEW
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GameCard;
