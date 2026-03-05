import React, { useState, useEffect } from 'react';
import { getAssetUrl } from '@/pages/PlayActivityPage';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Volume2 } from 'lucide-react';

interface TapIdentifyGameProps {
  step: any;
  onSuccess: () => void;
}

const TapIdentifyGame: React.FC<TapIdentifyGameProps> = ({ step, onSuccess }) => {
  const data = step.data || {};
  const question = data.question || data.instruction || 'Tap the correct answer!';
  const options: { label: string; image?: string; correct?: boolean }[] = data.options || [];
  const instructionAudio = step.instruction_audio_url;

  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (instructionAudio) {
      const audio = new Audio(getAssetUrl(instructionAudio));
      audio.play().catch(() => {});
    }
  }, [instructionAudio]);

  const handleTap = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    if (options[index]?.correct) {
      setTimeout(onSuccess, 1000);
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setShowResult(false);
  };

  const isCorrect = selected !== null && options[selected]?.correct;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Question */}
      <div className="flex items-center gap-2">
        <p className="text-xl font-bold text-foreground text-center">{question}</p>
        {instructionAudio && (
          <button
            onClick={() => new Audio(getAssetUrl(instructionAudio)).play().catch(() => {})}
            className="text-primary hover:text-primary/80"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Prompt image */}
      {data.image && (
        <img
          src={getAssetUrl(data.image)}
          alt="Question"
          className="w-32 h-32 object-contain rounded-xl"
        />
      )}

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          let borderClass = 'border-border';
          if (showResult && isSelected) {
            borderClass = opt.correct ? 'border-green-500 bg-green-50' : 'border-red-400 bg-red-50';
          }

          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTap(i)}
              className={`p-4 rounded-2xl border-2 ${borderClass} bg-card transition-all flex flex-col items-center gap-2 hover:shadow-md`}
            >
              {opt.image && (
                <img src={getAssetUrl(opt.image)} alt={opt.label} className="w-16 h-16 object-contain" />
              )}
              <span className="font-semibold text-foreground text-sm">{opt.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Result feedback */}
      {showResult && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-2">
          {isCorrect ? (
            <div className="flex items-center gap-2 text-green-600 font-bold">
              <CheckCircle className="w-6 h-6" /> Correct! 🌟
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-red-500 font-bold">
                <XCircle className="w-6 h-6" /> Not quite!
              </div>
              <Button variant="outline" size="sm" onClick={handleRetry}>Try Again</Button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TapIdentifyGame;
