
import React, { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PuzzleGamesProps {
  onBack: () => void;
}

const PuzzleGames = ({ onBack }: PuzzleGamesProps) => {
  const [activeGame, setActiveGame] = useState<'menu' | 'matching' | 'puzzle' | 'memory'>('menu');
  const [matchingScore, setMatchingScore] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const matchingPairs = [
    { letter: 'A', image: '🍎', word: 'Apple' },
    { letter: 'B', image: '🐻', word: 'Bear' },
    { letter: 'C', image: '🐱', word: 'Cat' },
    { letter: 'D', image: '🐕', word: 'Dog' },
  ];

  const handleMatching = (item: string) => {
    if (selectedItems.length === 0) {
      setSelectedItems([item]);
    } else if (selectedItems.length === 1) {
      const [first] = selectedItems;
      // Check if items match (same letter)
      const firstLetter = matchingPairs.find(p => p.letter === first || p.image === first || p.word === first)?.letter;
      const secondLetter = matchingPairs.find(p => p.letter === item || p.image === item || p.word === item)?.letter;
      
      if (firstLetter === secondLetter && first !== item) {
        setMatchingScore(score => score + 1);
        setTimeout(() => setSelectedItems([]), 1000);
      } else {
        setTimeout(() => setSelectedItems([]), 1000);
      }
    }
  };

  const puzzleGames = [
    {
      id: 'matching',
      title: 'Match Letters',
      icon: '🔤',
      description: 'Match letters with pictures',
      color: 'bg-blue-100'
    },
    {
      id: 'puzzle',
      title: 'Jigsaw Puzzle',
      icon: '🧩',
      description: 'Complete the picture',
      color: 'bg-green-100'
    },
    {
      id: 'memory',
      title: 'Memory Game',
      icon: '🧠',
      description: 'Find matching pairs',
      color: 'bg-purple-100'
    }
  ];

  if (activeGame === 'matching') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-400 to-green-300 p-6">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => setActiveGame('menu')}
            className="bg-white/20 hover:bg-white/30 rounded-full p-4 shadow-lg"
            variant="outline"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Button>
          <h1 className="text-4xl font-bold text-white">Match Letters & Pictures</h1>
          <div className="bg-white/20 rounded-full px-6 py-3">
            <span className="text-white font-bold">Score: {matchingScore}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {/* Letters Column */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white text-center">Letters</h2>
              {matchingPairs.map((pair) => (
                <button
                  key={pair.letter}
                  onClick={() => handleMatching(pair.letter)}
                  className={`w-full bg-white rounded-2xl p-6 shadow-lg transform transition-all hover:scale-105 ${
                    selectedItems.includes(pair.letter) ? 'ring-4 ring-yellow-400' : ''
                  }`}
                >
                  <span className="text-4xl font-bold text-blue-800">{pair.letter}</span>
                </button>
              ))}
            </div>

            {/* Images Column */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white text-center">Pictures</h2>
              {matchingPairs.map((pair) => (
                <button
                  key={pair.image}
                  onClick={() => handleMatching(pair.image)}
                  className={`w-full bg-white rounded-2xl p-6 shadow-lg transform transition-all hover:scale-105 ${
                    selectedItems.includes(pair.image) ? 'ring-4 ring-yellow-400' : ''
                  }`}
                >
                  <span className="text-4xl">{pair.image}</span>
                </button>
              ))}
            </div>

            {/* Words Column */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white text-center">Words</h2>
              {matchingPairs.map((pair) => (
                <button
                  key={pair.word}
                  onClick={() => handleMatching(pair.word)}
                  className={`w-full bg-white rounded-2xl p-6 shadow-lg transform transition-all hover:scale-105 ${
                    selectedItems.includes(pair.word) ? 'ring-4 ring-yellow-400' : ''
                  }`}
                >
                  <span className="text-xl font-bold text-blue-800">{pair.word}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-400 to-green-300 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          onClick={onBack}
          className="bg-white/20 hover:bg-white/30 rounded-full p-4 shadow-lg"
          variant="outline"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </Button>
        
        <h1 className="text-4xl font-bold text-white text-center flex-1">
          🧩 Puzzle Games 🧩
        </h1>
        
        <div className="w-20"></div>
      </div>

      {/* Game Selection */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {puzzleGames.map((game) => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id as any)}
              className={`group relative bg-white rounded-3xl p-8 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                game.id !== 'matching' ? 'opacity-60' : ''
              }`}
              disabled={game.id !== 'matching'}
            >
              <div className="text-6xl mb-4">{game.icon}</div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{game.title}</h2>
              <p className="text-slate-600">{game.description}</p>
              {game.id !== 'matching' && (
                <div className="absolute inset-0 bg-white/50 rounded-3xl flex items-center justify-center">
                  <span className="text-xl font-bold text-slate-700">Coming Soon!</span>
                </div>
              )}
              
              <div className="absolute top-2 right-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity animate-bounce">
                ⭐
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center py-8">
        <p className="text-2xl font-bold text-white drop-shadow-lg">
          🌟 Choose a puzzle game to start playing! 🌟
        </p>
      </div>

      {/* Bottom decoration */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-400 to-transparent pointer-events-none">
        <div className="absolute bottom-4 left-8 text-6xl animate-bounce">🧩</div>
        <div className="absolute bottom-4 right-8 text-6xl animate-bounce delay-500">🎯</div>
      </div>
    </div>
  );
};

export default PuzzleGames;
