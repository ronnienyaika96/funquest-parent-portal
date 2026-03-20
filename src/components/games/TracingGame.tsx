import React, { useState, useEffect } from 'react';
import { getAssetUrl } from '@/pages/PlayActivityPage';
import LetterTraceCanvas from '@/components/gaming/LetterTraceCanvas';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import FeedbackOverlay from './FeedbackOverlay';
import InstructionBar from './InstructionBar';

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
    <div className="flex flex-col items-center gap-5">
      {data.instruction && (
        <InstructionBar text={data.instruction} audioUrl={instructionAudio} />
      )}

      {/* Tracing area wrapped in a premium card */}
      <div className="bg-card rounded-3xl shadow-medium border border-border/50 p-3 sm:p-4">
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
      </div>

      <FeedbackOverlay
        show={result !== 'idle'}
        correct={result === 'success' ? true : result === 'fail' ? false : null}
        correctText="Great tracing! ⭐"
        wrongText="Follow the shape carefully"
        onRetry={result === 'fail' ? handleRetry : undefined}
      />

      {result === 'idle' && tracing.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRetry}
          className="rounded-full gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4" /> Clear
        </Button>
      )}
    </div>
  );
};

export default TracingGame;
