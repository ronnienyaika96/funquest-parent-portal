
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import KidsHeader from '@/components/kids/KidsHeader';
import GameCarousel from '@/components/kids/GameCarousel';
import LearningPathMap from '@/components/kids/LearningPathMap';
import ParentalGate from '@/components/kids/ParentalGate';

// Game data with playful colors
const continuePlayingGames = [
  { id: 'tracing-a', title: 'Letter A', emoji: '🔤', color: 'bg-gradient-to-br from-sky-400 to-sky-600', progress: 75 },
  { id: 'numbers-123', title: 'Count 1-2-3', emoji: '🔢', color: 'bg-gradient-to-br from-green-400 to-green-600', progress: 40 },
  { id: 'colors-rainbow', title: 'Rainbow Colors', emoji: '🌈', color: 'bg-gradient-to-br from-purple-400 to-pink-500', progress: 90 },
  { id: 'animals-farm', title: 'Farm Animals', emoji: '🐄', color: 'bg-gradient-to-br from-yellow-400 to-orange-500', progress: 20 },
  { id: 'shapes-fun', title: 'Shape Hunt', emoji: '⭐', color: 'bg-gradient-to-br from-red-400 to-red-600', progress: 55 },
];

const newAdventuresGames = [
  { id: 'music-beats', title: 'Music Maker', emoji: '🎵', color: 'bg-gradient-to-br from-pink-400 to-rose-600', isNew: true },
  { id: 'space-explore', title: 'Space Trip', emoji: '🚀', color: 'bg-gradient-to-br from-indigo-500 to-purple-600', isNew: true },
  { id: 'ocean-dive', title: 'Ocean World', emoji: '🐠', color: 'bg-gradient-to-br from-cyan-400 to-blue-600', isNew: true },
  { id: 'dino-adventure', title: 'Dino Land', emoji: '🦕', color: 'bg-gradient-to-br from-emerald-400 to-teal-600', isNew: true },
  { id: 'cooking-fun', title: 'Cooking Time', emoji: '🍳', color: 'bg-gradient-to-br from-amber-400 to-orange-500', isNew: true },
];

const KidsDashboard = () => {
  const navigate = useNavigate();
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [showParentalGate, setShowParentalGate] = useState(false);

  const handleGameClick = (gameId: string) => {
    // Navigate to game or start gaming mode
    console.log('Starting game:', gameId);
    // For now, you can integrate with your existing gaming interface
    navigate(`/?startGame=tracing`);
  };

  const handleParentalSuccess = () => {
    // Navigate to parent area
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-green-50">
      {/* Header */}
      <KidsHeader
        onLearningPathClick={() => setShowLearningPath(true)}
        onGrownUpsClick={() => setShowParentalGate(true)}
        childName="Little Star"
      />

      {/* Main Content */}
      <main className="py-6 pb-24">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 sm:mx-6 mb-8"
        >
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 right-8 text-6xl opacity-20">⭐</div>
            <div className="absolute bottom-4 right-24 text-4xl opacity-20">🌟</div>
            <div className="absolute top-8 right-32 text-3xl opacity-20">✨</div>
            
            <div className="relative z-10">
              <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2 drop-shadow-md">
                🎉 What shall we learn today?
              </h2>
              <p className="text-white/90 text-lg">
                Pick a game and start your adventure!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Game Carousels */}
        <GameCarousel
          title="Continue Playing"
          titleEmoji="🎮"
          games={continuePlayingGames}
          onGameClick={handleGameClick}
        />

        <GameCarousel
          title="New Adventures"
          titleEmoji="✨"
          games={newAdventuresGames}
          onGameClick={handleGameClick}
        />

      </main>

      {/* Learning Path Map Modal */}
      <LearningPathMap
        isOpen={showLearningPath}
        onClose={() => setShowLearningPath(false)}
        onLevelClick={(levelId) => {
          console.log('Level clicked:', levelId);
          setShowLearningPath(false);
        }}
      />

      {/* Parental Gate Modal */}
      <ParentalGate
        isOpen={showParentalGate}
        onClose={() => setShowParentalGate(false)}
        onSuccess={handleParentalSuccess}
      />
    </div>
  );
};

export default KidsDashboard;
