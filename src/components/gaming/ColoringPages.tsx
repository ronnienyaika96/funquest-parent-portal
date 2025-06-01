
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Palette, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ColoringPagesProps {
  onBack: () => void;
}

const ColoringPages = ({ onBack }: ColoringPagesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const colors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', 
    '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280',
    '#000000', '#ffffff', '#a3a3a3', '#fbbf24'
  ];

  const templates = [
    { name: 'Cute Cat', emoji: '🐱' },
    { name: 'Happy Sun', emoji: '☀️' },
    { name: 'Beautiful Flower', emoji: '🌸' },
    { name: 'Funny Fish', emoji: '🐠' }
  ];

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawTemplate();
      }
    }
  };

  const drawTemplate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple template drawings (in a real app, you'd load actual images)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    switch (selectedTemplate) {
      case 0: // Cat
        // Cat face circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Cat ears
        ctx.beginPath();
        ctx.moveTo(centerX - 60, centerY - 60);
        ctx.lineTo(centerX - 40, centerY - 100);
        ctx.lineTo(centerX - 20, centerY - 60);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 20, centerY - 60);
        ctx.lineTo(centerX + 40, centerY - 100);
        ctx.lineTo(centerX + 60, centerY - 60);
        ctx.stroke();
        
        // Eyes
        ctx.beginPath();
        ctx.arc(centerX - 25, centerY - 20, 8, 0, 2 * Math.PI);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX + 25, centerY - 20, 8, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Nose
        ctx.beginPath();
        ctx.moveTo(centerX - 5, centerY);
        ctx.lineTo(centerX, centerY - 5);
        ctx.lineTo(centerX + 5, centerY);
        ctx.stroke();
        
        // Mouth
        ctx.beginPath();
        ctx.arc(centerX - 15, centerY + 15, 10, 0, Math.PI);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX + 15, centerY + 15, 10, 0, Math.PI);
        ctx.stroke();
        break;
        
      case 1: // Sun
        // Sun center
        ctx.beginPath();
        ctx.arc(centerX, centerY, 60, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Sun rays
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const x1 = centerX + Math.cos(angle) * 80;
          const y1 = centerY + Math.sin(angle) * 80;
          const x2 = centerX + Math.cos(angle) * 100;
          const y2 = centerY + Math.sin(angle) * 100;
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        
        // Happy face
        ctx.beginPath();
        ctx.arc(centerX - 20, centerY - 15, 5, 0, 2 * Math.PI);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX + 20, centerY - 15, 5, 0, 2 * Math.PI);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY + 10, 25, 0, Math.PI);
        ctx.stroke();
        break;
        
      case 2: // Flower
        // Flower center
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Petals
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = centerX + Math.cos(angle) * 40;
          const y = centerY + Math.sin(angle) * 40;
          
          ctx.beginPath();
          ctx.arc(x, y, 25, 0, 2 * Math.PI);
          ctx.stroke();
        }
        
        // Stem
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 20);
        ctx.lineTo(centerX, centerY + 120);
        ctx.stroke();
        
        // Leaves
        ctx.beginPath();
        ctx.arc(centerX - 20, centerY + 80, 15, 0, 2 * Math.PI);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX + 20, centerY + 100, 15, 0, 2 * Math.PI);
        ctx.stroke();
        break;
        
      case 3: // Fish
        // Fish body
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 80, 50, 0, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Fish tail
        ctx.beginPath();
        ctx.moveTo(centerX - 80, centerY - 20);
        ctx.lineTo(centerX - 120, centerY);
        ctx.lineTo(centerX - 80, centerY + 20);
        ctx.stroke();
        
        // Eye
        ctx.beginPath();
        ctx.arc(centerX + 30, centerY - 15, 12, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Pupil
        ctx.beginPath();
        ctx.arc(centerX + 35, centerY - 15, 5, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Mouth
        ctx.beginPath();
        ctx.arc(centerX + 60, centerY, 8, Math.PI, 2 * Math.PI);
        ctx.stroke();
        
        // Fins
        ctx.beginPath();
        ctx.moveTo(centerX - 20, centerY - 50);
        ctx.lineTo(centerX - 10, centerY - 70);
        ctx.lineTo(centerX + 10, centerY - 50);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(centerX - 20, centerY + 50);
        ctx.lineTo(centerX - 10, centerY + 70);
        ctx.lineTo(centerX + 10, centerY + 50);
        ctx.stroke();
        break;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 500;
    canvas.height = 500;
    
    // Set white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawTemplate();

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      setIsDrawing(true);
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
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

    const stopDrawing = () => setIsDrawing(false);

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
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
  }, [selectedColor, brushSize, isDrawing, selectedTemplate]);

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `coloring-${templates[selectedTemplate].name}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-yellow-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onBack}
          className="bg-white/80 hover:bg-white rounded-2xl p-4 shadow-lg"
          variant="outline"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back to Games
        </Button>
        
        <h1 className="text-4xl font-bold text-gray-800">
          🎨 Coloring Fun! 🎨
        </h1>
        
        <div className="flex space-x-2">
          <Button
            onClick={downloadDrawing}
            className="bg-green-400 hover:bg-green-500 rounded-2xl p-4 shadow-lg text-white"
          >
            <Download className="w-6 h-6" />
          </Button>
          <Button
            onClick={clearCanvas}
            className="bg-red-400 hover:bg-red-500 rounded-2xl p-4 shadow-lg text-white"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template Selection */}
          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Choose a Picture:</h3>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTemplate(index)}
                  className={`p-4 rounded-2xl text-center transition-all ${
                    selectedTemplate === index 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-3xl mb-2">{template.emoji}</div>
                  <div className="text-sm font-medium">{template.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                className="border-4 border-gray-200 rounded-2xl cursor-crosshair"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </div>

          {/* Tools */}
          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            {/* Colors */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">Colors:</h3>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-full border-4 transition-all ${
                    selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Brush Size */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">Brush Size:</h3>
            <div className="space-y-3">
              {[5, 10, 20, 30].map((size) => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`w-full p-3 rounded-xl flex items-center justify-center transition-all ${
                    brushSize === size 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div 
                    className="bg-current rounded-full"
                    style={{ width: size, height: size }}
                  />
                  <span className="ml-3 font-medium">{size}px</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorations */}
      <div className="fixed bottom-8 left-8 text-5xl animate-bounce">🌈</div>
      <div className="fixed top-1/4 right-8 text-4xl animate-pulse">🎨</div>
      <div className="fixed bottom-1/4 right-1/4 text-6xl animate-bounce delay-1000">✨</div>
    </div>
  );
};

export default ColoringPages;
