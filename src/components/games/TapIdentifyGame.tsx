import React, { useState, useEffect, useMemo } from 'react';
import { getAssetUrl } from '@/pages/PlayActivityPage';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { getChoiceAssetByState, TileState } from '@/lib/gameAssets';
import { getInstructionText, resolveOptionAsset } from '@/lib/gameHelpers';

interface TapIdentifyGameProps {
  step: any;
  onSuccess: () => void;
}

const Cloud: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute rounded-full bg-white/20 pointer-events-none ${className}`} />
);

const TapIdentifyGame: React.FC<TapIdentifyGameProps> = ({ step, onSuccess }) => {
  const data = step.data || {};
  const question = getInstructionText(data);

  const rawOptions: any[] = Array.isArray(data.options) ? data.options : [];
  const options = rawOptions.map((opt: any) => ({
    label: typeof opt === 'string' ? opt : typeof opt?.label === 'string' ? opt.label : String(opt?.label ?? ''),
    image: opt?.image,
    correct: !!opt?.correct,
  }));

  const instructionAudio = step.instruction_audio_url;

  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [reinforcement, setReinforcement] = useState<string | null>(null);

  useEffect(() => {
    if (instructionAudio) {
      new Audio(getAssetUrl(instructionAudio)).play().catch(() => {});
    }
  }, [instructionAudio]);

  useEffect(() => {
    setSelected(null);
    setShowResult(false);
    setReinforcement(null);
  }, [step.id]);

  const handleTap = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);

    const opt = options[index];
    if (opt?.correct) {
      setReinforcement(data.reinforcement_text || 'Great job! 🌟');
      setTimeout(onSuccess, 1200);
    } else {
      setReinforcement('Try again! You can do it! 💪');
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setShowResult(false);
    setReinforcement(null);
  };

  const isCorrect = selected !== null && options[selected]?.correct;

  // Pre-resolve tile state URLs
  const tileUrls = useMemo(() => ({
    default: getChoiceAssetByState('default'),
    selected: getChoiceAssetByState('selected'),
    correct: getChoiceAssetByState('correct'),
    wrong: getChoiceAssetByState('wrong'),
  }), []);

  const getTileState = (index: number): TileState => {
    if (!showResult) return selected === index ? 'selected' : 'default';
    if (selected !== index) return 'default';
    return options[index]?.correct ? 'correct' : 'wrong';
  };

  const playAudio = () => {
    if (!instructionAudio) return;
    new Audio(getAssetUrl(instructionAudio)).play().catch(() => {});
  };

  const labelColors = ['#E8A735', '#4A90D9', '#34B87A', '#E05C7A', '#7B61D9', '#E8753A'];

  return (
    <div
      className="relative w-full min-h-[80vh] flex flex-col items-center overflow-hidden rounded-[2rem]"
      style={{
        background: 'linear-gradient(180deg, hsl(205 80% 68%) 0%, hsl(207 78% 74%) 40%, hsl(210 75% 80%) 100%)',
      }}
    >
      {/* Clouds */}
      <Cloud className="w-36 h-12 top-[10%] left-[5%] blur-lg opacity-40" />
      <Cloud className="w-52 h-16 top-[8%] right-[2%] blur-xl opacity-35" />
      <Cloud className="w-28 h-10 top-[25%] left-[60%] blur-lg opacity-30" />
      <Cloud className="w-44 h-14 top-[50%] left-[-2%] blur-xl opacity-25" />
      <Cloud className="w-32 h-10 bottom-[30%] right-[10%] blur-lg opacity-30" />
      <Cloud className="w-56 h-18 bottom-[5%] left-[20%] blur-xl opacity-20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-xl px-5 pt-8 pb-4 gap-5 flex-1">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-extrabold text-white text-center tracking-wide"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.12)', fontFamily: "'Nunito', 'Comic Sans MS', sans-serif" }}
        >
          Tap to Identify
        </motion.h1>

        {/* Instruction panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full rounded-full px-8 py-3.5 flex items-center justify-center gap-3"
          style={{ background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(8px)' }}
        >
          <p
            className="text-center text-lg sm:text-xl font-bold leading-snug"
            style={{ color: 'hsl(215 40% 30%)', fontFamily: "'Nunito', sans-serif" }}
          >
            {question}
          </p>
          {instructionAudio && (
            <button
              onClick={playAudio}
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-90"
              style={{ background: 'rgba(255,255,255,0.5)' }}
            >
              <Volume2 className="w-5 h-5" style={{ color: 'hsl(215 60% 45%)' }} />
            </button>
          )}
        </motion.div>

        {/* Prompt image */}
        {data.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="flex-1 flex items-center justify-center w-full py-4"
          >
            <img
              src={getAssetUrl(data.image)}
              alt="Question prompt"
              className="max-w-[80%] max-h-[240px] sm:max-h-[280px] object-contain drop-shadow-lg"
            />
          </motion.div>
        )}
        {!data.image && <div className="flex-1" />}

        {/* Answer tiles on shelf */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-4 px-2 mb-[-20px] relative z-10">
            {options.map((opt, i) => {
              const state = getTileState(i);
              const tileBg = tileUrls[state];
              const isThisSelected = selected === i;
              const isThisCorrect = showResult && isThisSelected && opt.correct;
              const isThisWrong = showResult && isThisSelected && !opt.correct;

              // Try to resolve an SVG asset for this label
              const assetUrl = opt.image ? getAssetUrl(opt.image) : resolveOptionAsset(opt.label);

              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.05 }}
                  animate={
                    isThisCorrect
                      ? { scale: [1, 1.15, 1.06], transition: { duration: 0.4 } }
                      : isThisWrong
                      ? { x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4 } }
                      : {}
                  }
                  onClick={() => handleTap(i)}
                  className="relative cursor-pointer focus:outline-none"
                  style={{
                    width: `${Math.min(100, 320 / Math.max(options.length, 2))}px`,
                    height: `${Math.min(100, 320 / Math.max(options.length, 2))}px`,
                    filter: showResult && !isThisSelected ? 'opacity(0.45)' : 'none',
                  }}
                >
                  {/* Tile SVG background */}
                  <img
                    src={tileBg}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />
                  {/* Content: SVG asset or text fallback */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {assetUrl ? (
                      <img
                        src={assetUrl}
                        alt={opt.label}
                        className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-md"
                      />
                    ) : (
                      <span
                        className="font-extrabold drop-shadow-sm"
                        style={{
                          fontSize: 'clamp(2rem, 5vw, 3rem)',
                          color: labelColors[i % labelColors.length],
                          fontFamily: "'Nunito', sans-serif",
                        }}
                      >
                        {opt.label}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Blue shelf */}
          <div
            className="w-full rounded-[1.5rem] h-16 sm:h-20"
            style={{
              background: 'linear-gradient(180deg, hsl(215 65% 50%) 0%, hsl(220 60% 42%) 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          />
        </motion.div>

        {/* Feedback */}
        <AnimatePresence mode="wait">
          {reinforcement && (
            <motion.div
              key={reinforcement}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="w-full mt-2"
            >
              <div
                className="w-full rounded-2xl px-6 py-3 text-center"
                style={{
                  background: isCorrect
                    ? 'linear-gradient(135deg, hsl(142 70% 45%), hsl(155 65% 50%))'
                    : 'linear-gradient(135deg, hsl(215 70% 50%), hsl(225 65% 55%))',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                }}
              >
                <p
                  className="text-xl sm:text-2xl font-extrabold text-white tracking-wide"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  {reinforcement}
                </p>
              </div>

              {showResult && !isCorrect && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center mt-3"
                >
                  <button
                    onClick={handleRetry}
                    className="px-8 py-3 rounded-full bg-white/90 font-bold text-lg shadow-md hover:shadow-lg transition-shadow active:scale-95"
                    style={{ color: 'hsl(215 50% 30%)', fontFamily: "'Nunito', sans-serif" }}
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TapIdentifyGame;
