import React, { useState, useEffect } from 'react';
import { getAssetUrl } from '@/pages/PlayActivityPage';
import LetterTraceCanvas from '@/components/gaming/LetterTraceCanvas';
import { Button } from '@/components/ui/button';
import { CheckCircle, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface TracingGameProps {
  step: any;
  onSuccess: () => void;
}

const TracingGame: React.FC<TracingGameProps> = ({ step, onSuccess }) => {
  const data = step.data || {};
  const svgPath = data.svg_path || data.svgPath;
  const instructionAudio = step.instruction_audio_url;

  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [svgBounds, setSvgBounds] = useState({ width: 320, height: 320 });
  const [tracing, setTracing] = useState<{ x: number; y: number }[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const [result, setResult] = useState<'idle' | 'success' | 'fail'>('idle');

  useEffect(() => {
    if (!svgPath) return;
    const url = getAssetUrl(svgPath);
    fetch(url).then(r => r.text()).then(setSvgContent).catch(() => setSvgContent(null));
  }, [svgPath]);

  // Play instruction audio
  useEffect(() => {
    if (instructionAudio) {
      const audio = new Audio(getAssetUrl(instructionAudio));
      audio.play().catch(() => {});
    }
  }, [instructionAudio]);

  const handleTraceComplete = (r: 'success' | 'fail') => {
    setResult(r);
    if (r === 'success') {
      setTimeout(onSuccess, 800);
    }
  };

  const handleRetry = () => {
    setTracing([]);
    setCurrentStroke([]);
    setResult('idle');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {data.instruction && (
        <p className="text-center text-lg font-medium text-foreground">{data.instruction}</p>
      )}

      <LetterTraceCanvas
        svgContent={svgContent}
        svgBounds={svgBounds}
        tracing={tracing}
        setTracing={setTracing}
        currentStroke={currentStroke}
        setCurrentStroke={setCurrentStroke}
        onSvgBoundsDetected={setSvgBounds}
        onTraceComplete={handleTraceComplete}
      />

      {result === 'success' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2 text-green-600 font-bold text-lg"
        >
          <CheckCircle className="w-6 h-6" /> Great tracing! ⭐
        </motion.div>
      )}

      {result === 'fail' && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-muted-foreground text-sm">Try again! Follow the shape carefully.</p>
          <Button variant="outline" size="sm" onClick={handleRetry}>
            <RotateCcw className="w-4 h-4 mr-1" /> Retry
          </Button>
        </div>
      )}
    </div>
  );
};

export default TracingGame;
