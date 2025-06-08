
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, Volume2, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface LetterTracingProps {
  letter?: string;
  onBack: () => void;
}

const LetterTracing = ({ letter: initialLetter = 'A', onBack }: LetterTracingProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentLetter, setCurrentLetter] = useState(initialLetter);
  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [tracingPath, setTracingPath] = useState<{x: number, y: number}[]>([]);
  const [score, setScore] = useState(0);
  const { user } = useAuth();

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const currentIndex = alphabet.indexOf(currentLetter);

  // Load SVG from Supabase Storage
  const loadSVG = async (letter: string) => {
    setIsLoading(true);
    try {
      const { data } = supabase.storage
        .from('assets')
        .getPublicUrl(`tracing/${letter.toLowerCase()}.svg`);
      
      if (data?.publicUrl) {
        const response = await fetch(data.publicUrl);
        if (response.ok) {
          const svgText = await response.text();
          setSvgContent(svgText);
        } else {
          console.error(`Failed to load SVG for letter ${letter}`);
          setSvgContent('');
        }
      }
    } catch (error) {
      console.error('Error loading SVG:', error);
      setSvgContent('');
    } finally {
      setIsLoading(false);
    }
  };

  // Save progress to Supabase
  const saveProgress = async (completed: boolean, finalScore: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tracing_progress')
        .upsert({
          user_id: user.id,
          letter: currentLetter,
          completed,
          score: finalScore,
          attempts: attempts + 1,
          last_traced: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving progress:', error);
      } else {
        console.log('Progress saved successfully');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  useEffect(() => {
    loadSVG(currentLetter);
    setIsCompleted(false);
    setShowCelebration(false);
    setAttempts(0);
    setScore(0);
    setTracingPath([]);
  }, [currentLetter]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsCompleted(false);
        setShowCelebration(false);
        setTracingPath([]);
        setAttempts(prev => prev + 1);
      }
    }
  };

  const playLetterSound = () => {
    console.log(`Playing sound for letter ${currentLetter}`);
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const calculateScore = (pathLength: number) => {
    const baseScore = Math.max(100 - (attempts * 10), 10);
    const pathScore = Math.min(pathLength / 50, 1) * 50;
    return Math.round(baseScore + pathScore);
  };

  const handleComplete = () => {
    const finalScore = calculateScore(tracingPath.length);
    setScore(finalScore);
    setIsCompleted(true);
    setShowCelebration(true);
    
    saveProgress(true, finalScore);
    
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const goToNextLetter = () => {
    if (currentIndex < alphabet.length - 1) {
      setCurrentLetter(alphabet[currentIndex + 1]);
    }
  };

  const goToPreviousLetter = () => {
    if (currentIndex > 0) {
      setCurrentLetter(alphabet[currentIndex - 1]);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        canvas.width = Math.min(400, rect.width - 32);
        canvas.height = Math.min(400, rect.height - 32);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const getEventPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      if ('touches' in e) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY
        };
      } else {
        return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY
        };
      }
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      setIsDrawing(true);
      
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      
      const pos = getEventPos(e);
      ctx.moveTo(pos.x, pos.y);
      setTracingPath([pos]);
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      
      const pos = getEventPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      
      setTracingPath(prev => [...prev, pos]);
    };

    const stopDrawing = () => {
      if (isDrawing) {
        setIsDrawing(false);
        if (tracingPath.length > 30) {
          setTimeout(() => handleComplete(), 500);
        }
      }
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isDrawing, tracingPath]);

  const getLetterExample = (letter: string) => {
    const examples: Record<string, string> = {
      'A': '🍎 Apple', 'B': '🎈 Balloon', 'C': '🐱 Cat', 'D': '🐕 Dog',
      'E': '🥚 Egg', 'F': '🌸 Flower', 'G': '🦒 Giraffe', 'H': '🏠 House',
      'I': '🍦 Ice cream', 'J': '🃏 Joker', 'K': '🔑 Key', 'L': '🦁 Lion',
      'M': '🌙 Moon', 'N': '🪺 Nest', 'O': '🐙 Octopus', 'P': '🐧 Penguin',
      'Q': '👸 Queen', 'R': '🌈 Rainbow', 'S': '⭐ Star', 'T': '🌳 Tree',
      'U': '☂️ Umbrella', 'V': '🎻 Violin', 'W': '🐋 Whale', 'X': '❌ X-ray',
      'Y': '🧶 Yarn', 'Z': '🦓 Zebra'
    };
    return examples[letter] || `${letter} is for...`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading letter {currentLetter}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button onClick={onBack} className="bg-white/80 hover:bg-white rounded-2xl p-4 shadow-lg" variant="outline">
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back to ABC
        </Button>
        
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 text-center flex-1 mx-4">
          ✏️ Trace the Letter {currentLetter}! ✏️
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

      {/* Letter Navigation */}
      <div className="flex items-center justify-center mb-6 space-x-4">
        <Button 
          onClick={goToPreviousLetter} 
          disabled={currentIndex === 0}
          className="bg-white/80 hover:bg-white rounded-full p-3 shadow-lg disabled:opacity-50"
          variant="outline"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        
        <div className="bg-white/90 rounded-2xl px-6 py-3 shadow-lg">
          <span className="text-2xl font-bold text-gray-800">
            {currentIndex + 1} / {alphabet.length}
          </span>
        </div>
        
        <Button 
          onClick={goToNextLetter} 
          disabled={currentIndex === alphabet.length - 1}
          className="bg-white/80 hover:bg-white rounded-full p-3 shadow-lg disabled:opacity-50"
          variant="outline"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tracing Canvas */}
          <div className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-gray-700">
              Trace with your finger!
            </h2>
            
            <div className="relative flex justify-center items-center">
              {/* SVG Background */}
              {svgContent && (
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              )}
              
              {/* Tracing Canvas */}
              <canvas 
                ref={canvasRef} 
                className="border-4 border-dashed border-gray-300 rounded-2xl cursor-crosshair touch-none relative z-10 bg-transparent"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  aspectRatio: '1/1'
                }}
              />
            </div>
            
            {/* Progress Info */}
            <div className="mt-4 text-center space-y-2">
              <p className="text-sm text-gray-600">Attempts: {attempts}</p>
              {score > 0 && (
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-lg font-bold text-yellow-600">Score: {score}</span>
                </div>
              )}
            </div>
          </div>

          {/* Letter Information */}
          <div className="space-y-6">
            {/* Letter Example */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                {currentLetter} is for...
              </h3>
              <div className="text-4xl md:text-6xl mb-4">{getLetterExample(currentLetter)}</div>
              <p className="text-lg md:text-xl text-gray-600">
                Say it out loud: "{currentLetter}!"
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">How to trace:</h3>
              <ul className="text-base md:text-lg text-gray-600 space-y-2">
                <li>👆 Use your finger or mouse</li>
                <li>➡️ Follow the letter outline</li>
                <li>🎯 Take your time</li>
                <li>🌟 Have fun!</li>
              </ul>
            </div>

            {/* Quick Navigation */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Jump:</h3>
              <div className="grid grid-cols-6 gap-2">
                {alphabet.slice(0, 12).map((letter) => (
                  <Button
                    key={letter}
                    onClick={() => setCurrentLetter(letter)}
                    variant={letter === currentLetter ? "default" : "outline"}
                    className="aspect-square text-sm font-bold"
                  >
                    {letter}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {alphabet.slice(12, 24).map((letter) => (
                  <Button
                    key={letter}
                    onClick={() => setCurrentLetter(letter)}
                    variant={letter === currentLetter ? "default" : "outline"}
                    className="aspect-square text-sm font-bold"
                  >
                    {letter}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {alphabet.slice(24).map((letter) => (
                  <Button
                    key={letter}
                    onClick={() => setCurrentLetter(letter)}
                    variant={letter === currentLetter ? "default" : "outline"}
                    className="aspect-square text-sm font-bold"
                  >
                    {letter}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-3xl animate-scale-in max-w-md w-full">
            <div className="text-6xl md:text-8xl mb-4">🎉</div>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
              Great Job!
            </h2>
            <p className="text-lg md:text-2xl text-gray-600 mb-4">
              You traced the letter {currentLetter} perfectly!
            </p>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Star className="w-8 h-8 text-yellow-500 fill-current" />
              <span className="text-3xl font-bold text-yellow-600">{score}</span>
              <span className="text-lg text-gray-600">points!</span>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center">
              <Button 
                onClick={() => setShowCelebration(false)} 
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl text-lg"
              >
                Continue! 🌟
              </Button>
              {currentIndex < alphabet.length - 1 && (
                <Button 
                  onClick={() => {
                    setShowCelebration(false);
                    goToNextLetter();
                  }} 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl text-lg"
                >
                  Next Letter →
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating decorations */}
      <div className="fixed bottom-8 right-8 text-4xl md:text-5xl animate-bounce">🌟</div>
      <div className="fixed top-1/4 left-8 text-3xl md:text-4xl animate-pulse">🎈</div>
      {isCompleted && <div className="fixed top-1/2 right-1/4 text-5xl md:text-6xl animate-bounce">✨</div>}
    </div>
  );
};

export default LetterTracing;
