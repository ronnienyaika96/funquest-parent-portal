import React, { useState, useEffect } from 'react';
import { getAssetUrl } from '@/pages/PlayActivityPage';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { getGameAssetUrl, TILE_ASSETS } from '@/lib/funquest-assets';
import FeedbackOverlay from './FeedbackOverlay';
import InstructionBar from './InstructionBar';

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

  // Get tile background URL based on state
  const getTileBg = (index: number) => {
    if (!showResult || selected !== index) return getGameAssetUrl(TILE_ASSETS.choiceDefault);
    return options[index]?.correct
      ? getGameAssetUrl(TILE_ASSETS.choiceCorrect)
      : getGameAssetUrl(TILE_ASSETS.choiceWrong);
  };

  const getSelectedTileBg = (index: number) => {
    if (selected === index && !showResult) return getGameAssetUrl(TILE_ASSETS.choiceSelected);
    return getTileBg(index);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <InstructionBar text={question} audioUrl={instructionAudio} />

      {/* Prompt image */}
      {data.image && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-36 h-36 rounded-3xl bg-card border-2 border-border/50 shadow-soft flex items-center justify-center overflow-hidden"
        >
          <img
            src={getAssetUrl(data.image)}
            alt="Question"
            className="w-28 h-28 object-contain"
          />
        </motion.div>
      )}

      {/* Options grid with tile assets */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const tileBg = getSelectedTileBg(i);

          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleTap(i)}
              className="relative rounded-3xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow active:scale-95 aspect-square"
              style={{
                backgroundImage: `url(${tileBg})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            >
              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3">
                {opt.image && (
                  <img src={getAssetUrl(opt.image)} alt={opt.label} className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-md" />
                )}
                <span className="font-bold text-foreground text-sm sm:text-base leading-tight text-center">
                  {opt.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <FeedbackOverlay
        show={showResult}
        correct={isCorrect ?? null}
        onRetry={!isCorrect ? handleRetry : undefined}
      />
    </div>
  );
};

export default TapIdentifyGame;
