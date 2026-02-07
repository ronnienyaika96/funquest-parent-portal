
import React from 'react';
import { motion } from 'framer-motion';

interface GameCardProps {
  title: string;
  emoji: string;
  color: string;
  progress?: number;
  isNew?: boolean;
  onClick?: () => void;
}

const GameCard = ({ title, emoji, color, progress, isNew, onClick }: GameCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative cursor-pointer flex-shrink-0"
    >
      <div 
        className={`w-52 h-60 sm:w-60 sm:h-72 rounded-3xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden ${color}`}
      >
        {/* Decorative circles */}
        <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full" />
        <div className="absolute bottom-6 right-6 w-12 h-12 bg-white/10 rounded-full" />
        <div className="absolute top-1/2 right-2 w-6 h-6 bg-white/15 rounded-full" />
        
        {/* Main emoji */}
        <span className="text-7xl sm:text-8xl mb-3 drop-shadow-lg">{emoji}</span>
        
        {/* Title */}
        <p className="text-white font-bold text-base sm:text-lg text-center px-3 drop-shadow-md">
          {title}
        </p>
        
        {/* Progress bar */}
        {progress !== undefined && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
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
            className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-md"
          >
            NEW!
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GameCard;
