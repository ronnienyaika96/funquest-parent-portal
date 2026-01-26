
import React from 'react';
import { motion } from 'framer-motion';
import { Map, Users } from 'lucide-react';

interface KidsHeaderProps {
  onLearningPathClick: () => void;
  onGrownUpsClick: () => void;
  childName?: string;
}

const KidsHeader = ({ onLearningPathClick, onGrownUpsClick, childName = 'Explorer' }: KidsHeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500 px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Logo & Greeting */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-4xl"
          >
            🌟
          </motion.div>
          <div>
            <h1 className="text-white font-bold text-xl sm:text-2xl drop-shadow-md">
              Hi, {childName}!
            </h1>
            <p className="text-white/80 text-sm hidden sm:block">Ready to learn today?</p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Learning Path Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLearningPathClick}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-lg transition-colors"
          >
            <Map className="w-5 h-5" />
            <span className="hidden sm:inline">My Journey</span>
          </motion.button>

          {/* Grown-ups Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGrownUpsClick}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-lg backdrop-blur-sm transition-colors border border-white/30"
          >
            <Users className="w-5 h-5" />
            <span className="hidden sm:inline">Grown-ups</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default KidsHeader;
