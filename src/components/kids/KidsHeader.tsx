import React from 'react';
import { motion } from 'framer-motion';
import { Map, Users, Star } from 'lucide-react';

interface KidsHeaderProps {
  onLearningPathClick: () => void;
  onGrownUpsClick: () => void;
  childName?: string;
}

const KidsHeader = ({ onLearningPathClick, onGrownUpsClick, childName = 'Explorer' }: KidsHeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-funquest-blue via-funquest-purple to-funquest-pink px-4 py-4 sm:px-6 shadow-medium">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {/* Left: Logo & Greeting */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
            className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-soft"
          >
            <Star className="w-7 h-7 text-funquest-warning fill-funquest-warning" />
          </motion.div>
          <div>
            <h1 className="text-white font-bold text-xl sm:text-2xl drop-shadow-md" style={{ lineHeight: '1.2' }}>
              Hi, {childName}!
            </h1>
            <p className="text-white/70 text-sm hidden sm:block">Ready to learn today?</p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onLearningPathClick}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-3.5 py-2.5 sm:px-4 rounded-full shadow-soft border border-white/20 transition-colors"
          >
            <Map className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">My Journey</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onGrownUpsClick}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white/90 font-semibold px-3.5 py-2.5 sm:px-4 rounded-full border border-white/15 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Grown-ups</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default KidsHeader;
