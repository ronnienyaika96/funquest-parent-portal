
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlphabetMenuProps {
  onLetterSelect: (letter: string) => void;
  onBack: () => void;
}

const AlphabetMenu = ({ onLetterSelect, onBack }: AlphabetMenuProps) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-400 to-green-300">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Button
          onClick={onBack}
          className="bg-white/20 hover:bg-white/30 rounded-full p-4 shadow-lg border-2 border-white/40"
          variant="outline"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </Button>
        
        <h1 className="text-5xl font-bold text-white text-center flex-1 drop-shadow-lg">
          🔤 Learn the Alphabet! 🔤
        </h1>
        
        <div className="w-20"></div>
      </div>

      {/* Alphabet Grid matching the uploaded image style */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {letters.map((letter, index) => (
            <button
              key={letter}
              onClick={() => onLetterSelect(letter)}
              className="group relative aspect-square bg-cream-100 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-2xl border-4 border-cream-200"
              style={{ backgroundColor: '#F5E6D3' }}
            >
              <div className="flex items-center justify-center h-full relative z-10">
                <span className="text-4xl md:text-5xl font-bold text-blue-800 drop-shadow-sm">
                  {letter}
                </span>
              </div>
              
              {/* Star decoration like in the uploaded image */}
              {index === 0 && (
                <div className="absolute top-1 right-1 text-yellow-400 text-xl">
                  ⭐
                </div>
              )}
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          ))}
        </div>
      </div>

      {/* Encouraging message */}
      <div className="text-center py-8">
        <p className="text-3xl font-bold text-white drop-shadow-lg">
          🌟 Click on any letter to start tracing! 🌟
        </p>
      </div>

      {/* Bottom decorative section matching uploaded image */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-400 to-transparent pointer-events-none">
        <div className="absolute bottom-4 right-12 text-8xl animate-bounce">
          🐊
        </div>
        <div className="absolute bottom-2 right-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">
          ⭐
        </div>
      </div>
    </div>
  );
};

export default AlphabetMenu;
