import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface LetterTracingProps {
  letter: string;
  onBack: () => void;
}
const LetterTracing = ({
  letter,
  onBack
}: LetterTracingProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsCompleted(false);
        setShowCelebration(false);
      }
    }
  };
  const playLetterSound = () => {
    // In a real app, you'd play actual audio files
    console.log(`Playing sound for letter ${letter}`);
    // For demo, we'll just show visual feedback
  };
  const handleComplete = () => {
    setIsCompleted(true);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Draw letter outline (dashed)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 10]);
    ctx.font = '300px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText(letter, 200, 200);
    const startDrawing = (e: MouseEvent | TouchEvent) => {
      setIsDrawing(true);
      ctx.setLineDash([]);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.offsetX;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.offsetY;
      ctx.moveTo(x, y);
    };
    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.offsetX;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.offsetY;
      ctx.lineTo(x, y);
      ctx.stroke();
    };
    const stopDrawing = () => {
      if (isDrawing) {
        setIsDrawing(false);
        // Simple completion detection - in a real app, you'd have more sophisticated stroke analysis
        setTimeout(() => handleComplete(), 1000);
      }
    };

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [letter, isDrawing]);
  const getLetterExample = (letter: string) => {
    const examples: Record<string, string> = {
      'A': '🍎 Apple',
      'B': '🎈 Balloon',
      'C': '🐱 Cat',
      'D': '🐕 Dog',
      'E': '🥚 Egg',
      'F': '🌸 Flower',
      'G': '🦒 Giraffe',
      'H': '🏠 House',
      'I': '🍦 Ice cream',
      'J': '🃏 Joker',
      'K': '🔑 Key',
      'L': '🦁 Lion',
      'M': '🌙 Moon',
      'N': '🪺 Nest',
      'O': '🐙 Octopus',
      'P': '🐧 Penguin',
      'Q': '👸 Queen',
      'R': '🌈 Rainbow',
      'S': '⭐ Star',
      'T': '🌳 Tree',
      'U': '☂️ Umbrella',
      'V': '🎻 Violin',
      'W': '🐋 Whale',
      'X': '❌ X-ray',
      'Y': '🧶 Yarn',
      'Z': '🦓 Zebra'
    };
    return examples[letter] || `${letter} is for...`;
  };
  return <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 p-4 bg-[#000a00]/[0.13]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button onClick={onBack} className="bg-white/80 hover:bg-white rounded-2xl p-4 shadow-lg" variant="outline">
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back to ABC
        </Button>
        
        <h1 className="text-4xl font-bold text-gray-800">
          ✏️ Trace the Letter {letter}! ✏️
        </h1>
        
        <div className="flex space-x-2">
          <Button onClick={playLetterSound} className="bg-yellow-400 hover:bg-yellow-500 rounded-2xl p-4 shadow-lg">
            <Volume2 className="w-6 h-6" />
          </Button>
          <Button onClick={clearCanvas} className="bg-red-400 hover:bg-red-500 rounded-2xl p-4 shadow-lg text-white">
            <RotateCcw className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tracing Canvas */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
              Trace with your finger!
            </h2>
            <div className="flex justify-center">
              <canvas ref={canvasRef} className="border-4 border-dashed border-gray-300 rounded-2xl cursor-crosshair" style={{
              maxWidth: '100%',
              height: 'auto'
            }} />
            </div>
          </div>

          {/* Letter Information */}
          <div className="space-y-6">
            {/* Letter Example */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {letter} is for...
              </h3>
              <div className="text-6xl mb-4">{getLetterExample(letter)}</div>
              <p className="text-xl text-gray-600">
                Say it out loud: "{letter}!"
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">How to trace:</h3>
              <ul className="text-lg text-gray-600 space-y-2">
                <li>👆 Use your finger or mouse</li>
                <li>➡️ Follow the dotted lines</li>
                <li>🎯 Take your time</li>
                <li>🌟 Have fun!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      {showCelebration && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-12 text-center shadow-3xl animate-scale-in">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Great Job!
            </h2>
            <p className="text-2xl text-gray-600 mb-6">
              You traced the letter {letter} perfectly!
            </p>
            <div className="flex space-x-4 justify-center">
              <Button onClick={() => setShowCelebration(false)} className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl text-xl">
                Continue! 🌟
              </Button>
            </div>
          </div>
        </div>}

      {/* Floating decorations */}
      <div className="fixed bottom-8 right-8 text-5xl animate-bounce">🌟</div>
      <div className="fixed top-1/4 left-8 text-4xl animate-pulse">🎈</div>
      {isCompleted && <div className="fixed top-1/2 right-1/4 text-6xl animate-bounce">✨</div>}
    </div>;
};
export default LetterTracing;