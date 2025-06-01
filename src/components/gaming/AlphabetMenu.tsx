
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlphabetMenuProps {
  onLetterSelect: (letter: string) => void;
  onBack: () => void;
}

const AlphabetMenu = ({ onLetterSelect, onBack }: AlphabetMenuProps) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  const getLetterColor = (index: number) => {
    const colors = [
      'from-red-400 to-red-500',
      'from-orange-400 to-orange-500',
      'from-yellow-400 to-yellow-500',
      'from-green-400 to-green-500',
      'from-blue-400 to-blue-500',
      'from-purple-400 to-purple-500',
      'from-pink-400 to-pink-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Button
          onClick={onBack}
          className="bg-white/80 hover:bg-white rounded-2xl p-4 shadow-lg"
          variant="outline"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </Button>
        
        <h1 className="text-4xl font-bold text-gray-800 text-center flex-1">
          🔤 Learn the Alphabet! 🔤
        </h1>
        
        <div className="w-20"></div> {/* Spacer */}
      </div>

      {/* Alphabet Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {letters.map((letter, index) => (
            <button
              key={letter}
              onClick={() => onLetterSelect(letter)}
              className={`group relative aspect-square rounded-3xl bg-gradient-to-br ${getLetterColor(index)} shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:rotate-3`}
            >
              <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-center h-full relative z-10">
                <span className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                  {letter}
                </span>
              </div>
              
              {/* Sparkle effect */}
              <div className="absolute top-2 right-2 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity animate-ping">
                ✨
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Encouraging message */}
      <div className="text-center py-8">
        <p className="text-2xl font-bold text-gray-700">
          🌟 Click on any letter to start tracing! 🌟
        </p>
      </div>

      {/* Floating decorations */}
      <div className="fixed bottom-8 left-8 text-5xl animate-bounce">🎈</div>
      <div className="fixed top-1/3 right-12 text-4xl animate-pulse">⭐</div>
      <div className="fixed bottom-1/3 left-1/4 text-6xl animate-bounce delay-500">🦄</div>
    </div>
  );
};

export default AlphabetMenu;
