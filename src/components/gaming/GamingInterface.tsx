import React, { useState } from 'react';
import { X, Home, Palette, PenTool, Puzzle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AlphabetMenu from './AlphabetMenu';
import LetterTracing from './LetterTracing';
import ColoringPages from './ColoringPages';

interface GamingInterfaceProps {
  onExitGaming: () => void;
}

const GamingInterface = ({ onExitGaming }: GamingInterfaceProps) => {
  const [activeGame, setActiveGame] = useState<'home' | 'alphabet' | 'tracing' | 'coloring' | 'puzzles'>('home');
  const [selectedLetter, setSelectedLetter] = useState<string>('');

  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter);
    setActiveGame('tracing');
  };

  const handleParentExit = () => {
    const confirmed = window.confirm("Parent Mode: Are you sure you want to exit child mode?");
    if (confirmed) {
      onExitGaming();
    }
  };

  const games = [
    {
      id: 'tracing',
      title: 'Letter Tracing',
      icon: '✏️',
      color: 'from-blue-400 to-blue-500',
      description: 'Trace letters with your finger!'
    },
    {
      id: 'coloring',
      title: 'Coloring Fun',
      icon: '🎨',
      color: 'from-purple-400 to-purple-500',
      description: 'Color beautiful pictures!'
    },
    {
      id: 'puzzles',
      title: 'Puzzles',
      icon: '🧩',
      color: 'from-green-400 to-green-500',
      description: 'Coming Soon!'
    }
  ];

  if (activeGame === 'alphabet') {
    return <AlphabetMenu onLetterSelect={handleLetterSelect} onBack={() => setActiveGame('home')} />;
  }

  if (activeGame === 'tracing') {
    return <LetterTracing letter={selectedLetter} onBack={() => setActiveGame('home')} />;
  }

  if (activeGame === 'coloring') {
    return <ColoringPages onBack={() => setActiveGame('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-2xl">
            🎮
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Fun Learning Games!</h1>
        </div>
        
        <Button
          onClick={handleParentExit}
          variant="outline"
          className="bg-white/80 hover:bg-white border-2 border-gray-300 p-3"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Game Selection Grid */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id as any)}
              disabled={game.id === 'puzzles'}
              className={`group relative overflow-hidden rounded-3xl p-8 text-left transform transition-all duration-300 hover:scale-105 shadow-2xl ${
                game.id === 'puzzles' ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-3xl'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-90`}></div>
              <div className="relative z-10">
                <div className="text-6xl mb-4">{game.icon}</div>
                <h2 className="text-3xl font-bold text-white mb-2">{game.title}</h2>
                <p className="text-xl text-white/90">{game.description}</p>
              </div>
              <div className="absolute bottom-4 right-4 text-white/70 group-hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="fixed bottom-4 left-4 text-6xl animate-bounce">🌟</div>
      <div className="fixed top-1/4 right-8 text-4xl animate-pulse">🎈</div>
      <div className="fixed bottom-1/4 right-1/4 text-5xl animate-bounce delay-1000">🦋</div>
    </div>
  );
};

export default GamingInterface;
