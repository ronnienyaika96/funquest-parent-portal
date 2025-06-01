
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AlphabetMenu from './AlphabetMenu';
import LetterTracing from './LetterTracing';
import ColoringPages from './ColoringPages';
import PuzzleGames from './PuzzleGames';

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

  if (activeGame === 'alphabet') {
    return <AlphabetMenu onLetterSelect={handleLetterSelect} onBack={() => setActiveGame('home')} />;
  }

  if (activeGame === 'tracing') {
    return <LetterTracing letter={selectedLetter} onBack={() => setActiveGame('alphabet')} />;
  }

  if (activeGame === 'coloring') {
    return <ColoringPages onBack={() => setActiveGame('home')} />;
  }

  if (activeGame === 'puzzles') {
    return <PuzzleGames onBack={() => setActiveGame('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-400 to-green-300">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg">
            🎮
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">ABC Tracing Game</h1>
            <p className="text-xl text-white/90">Learn and have fun!</p>
          </div>
        </div>
        
        <Button
          onClick={handleParentExit}
          className="bg-white/20 hover:bg-white/30 border-2 border-white/40 text-white p-3 rounded-full"
          variant="outline"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Game Selection Grid */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Alphabet Learning */}
          <button
            onClick={() => setActiveGame('alphabet')}
            className="group relative bg-white rounded-3xl p-8 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="text-6xl mb-4">🔤</div>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">ABC</h2>
            <p className="text-blue-600">Learn Letters</p>
            
            {/* Decorative elements */}
            <div className="absolute top-2 right-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity animate-bounce">
              ⭐
            </div>
          </button>

          {/* Letter Tracing */}
          <button
            onClick={() => setActiveGame('tracing')}
            className="group relative bg-white rounded-3xl p-8 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="text-6xl mb-4">✏️</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Trace</h2>
            <p className="text-green-600">Practice Writing</p>
            
            <div className="absolute top-2 right-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity animate-bounce">
              ⭐
            </div>
          </button>

          {/* Coloring */}
          <button
            onClick={() => setActiveGame('coloring')}
            className="group relative bg-white rounded-3xl p-8 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold text-purple-800 mb-2">Color</h2>
            <p className="text-purple-600">Paint Pictures</p>
            
            <div className="absolute top-2 right-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity animate-bounce">
              ⭐
            </div>
          </button>

          {/* Puzzles */}
          <button
            onClick={() => setActiveGame('puzzles')}
            className="group relative bg-white rounded-3xl p-8 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="text-6xl mb-4">🧩</div>
            <h2 className="text-2xl font-bold text-orange-800 mb-2">Puzzles</h2>
            <p className="text-orange-600">Play Games</p>
            
            <div className="absolute top-2 right-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity animate-bounce">
              ⭐
            </div>
          </button>
        </div>
      </div>

      {/* Bottom decorative elements matching the uploaded image */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-400 to-transparent pointer-events-none">
        <div className="absolute bottom-4 left-8 text-8xl animate-bounce">
          🐊
        </div>
        <div className="absolute bottom-2 right-12 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">
          ⭐
        </div>
      </div>

      {/* Floating decorations */}
      <div className="fixed top-1/4 left-8 text-4xl animate-bounce delay-1000">🎈</div>
      <div className="fixed top-1/3 right-16 text-5xl animate-pulse">⭐</div>
      <div className="fixed bottom-1/3 left-1/4 text-3xl animate-bounce delay-500">🌟</div>
    </div>
  );
};

export default GamingInterface;
