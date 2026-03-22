import React, { useState, useEffect, useMemo } from 'react';
import { getAssetUrl } from '@/pages/PlayActivityPage';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { getGameAssetUrl, TILE_ASSETS } from '@/lib/funquest-assets';

interface TapIdentifyGameProps {
  step: any;
  onSuccess: () => void;
}

/* ------------------------------------------------------------------ */
/*  Cloud shape – pure CSS decorative element                         */
/* ------------------------------------------------------------------ */
const Cloud: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <div
    className={`absolute rounded-full bg-white/30 blur-xl pointer-events-none ${className}`}
    style={{ ...style }}
  />
);

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
const TapIdentifyGame: React.FC<TapIdentifyGameProps> = ({ step, onSuccess }) => {
  const data = step.data || {};
  const rawQuestion = data.question || data.instruction || 'Tap the correct answer!';
  const question = typeof rawQuestion === 'string' ? rawQuestion : JSON.stringify(rawQuestion);
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

  // Play instruction audio on mount
  useEffect(() => {
    if (instructionAudio) {
      const audio = new Audio(getAssetUrl(instructionAudio));
      audio.play().catch(() => {});
    }
  }, [instructionAudio]);

  // Reset state when step changes
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
      // Build reinforcement text
      const label = opt.label || '';
      setReinforcement(data.reinforcement_text || `Great job! 🌟`);
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

  // Tile asset URLs
  const tileUrls = useMemo(() => ({
    default: getGameAssetUrl(TILE_ASSETS.choiceDefault),
    selected: getGameAssetUrl(TILE_ASSETS.choiceSelected),
    correct: getGameAssetUrl(TILE_ASSETS.choiceCorrect),
    wrong: getGameAssetUrl(TILE_ASSETS.choiceWrong),
  }), []);

  const getTileBg = (index: number) => {
    if (selected === index && !showResult) return tileUrls.selected;
    if (!showResult || selected !== index) return tileUrls.default;
    return options[index]?.correct ? tileUrls.correct : tileUrls.wrong;
  };

  const playAudio = () => {
    if (!instructionAudio) return;
    new Audio(getAssetUrl(instructionAudio)).play().catch(() => {});
  };

  /* Determine grid columns based on option count */
  const gridCols = options.length <= 2
    ? 'grid-cols-2'
    : options.length === 3
    ? 'grid-cols-3'
    : 'grid-cols-2 sm:grid-cols-4';

  return (
    <div className="relative w-full min-h-[80vh] flex flex-col items-center overflow-hidden rounded-[2rem]"
      style={{
        background: 'linear-gradient(180deg, hsl(205 85% 72%) 0%, hsl(210 80% 82%) 50%, hsl(215 75% 90%) 100%)',
      }}
    >
      {/* ---- Decorative clouds ---- */}
      <Cloud className="w-48 h-20 top-8 -left-10 opacity-50" />
      <Cloud className="w-64 h-24 top-16 right-[-2rem] opacity-40" />
      <Cloud className="w-40 h-16 top-[45%] left-4 opacity-30" />
      <Cloud className="w-56 h-20 bottom-24 right-8 opacity-35" />
      <Cloud className="w-32 h-14 bottom-40 left-12 opacity-25" />

      {/* ---- Content ---- */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-lg px-5 py-8 gap-6 flex-1">

        {/* 1. Title */}
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md text-center font-nunito tracking-wide"
        >
          Tap to Identify
        </motion.h1>

        {/* 2. Instruction Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-medium px-6 py-4 flex items-center gap-3"
        >
          <p className="flex-1 text-center text-lg sm:text-xl font-bold text-[hsl(220,60%,30%)] font-nunito leading-snug">
            {question}
          </p>
          {instructionAudio && (
            <button
              onClick={playAudio}
              className="flex-shrink-0 w-11 h-11 rounded-full bg-funquest-blue/15 hover:bg-funquest-blue/25 flex items-center justify-center transition-colors active:scale-90"
            >
              <Volume2 className="w-5 h-5 text-funquest-blue" />
            </button>
          )}
        </motion.div>

        {/* 3. Prompt image (counting visual, etc.) */}
        {data.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] bg-white/80 backdrop-blur-sm shadow-soft flex items-center justify-center border-4 border-white/60"
          >
            <img
              src={getAssetUrl(data.image)}
              alt="Question prompt"
              className="w-[80%] h-[80%] object-contain drop-shadow-sm"
            />
          </motion.div>
        )}

        {/* 4. Answer tiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`grid ${gridCols} gap-4 sm:gap-5 w-full`}
        >
          {options.map((opt, i) => {
            const tileBg = getTileBg(i);
            const isThisSelected = selected === i;
            const isThisCorrect = showResult && isThisSelected && opt.correct;
            const isThisWrong = showResult && isThisSelected && !opt.correct;

            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.04 }}
                animate={
                  isThisCorrect
                    ? { scale: [1, 1.12, 1.05], transition: { duration: 0.4 } }
                    : isThisWrong
                    ? { x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.4 } }
                    : {}
                }
                onClick={() => handleTap(i)}
                className="relative aspect-square rounded-[1.5rem] overflow-hidden cursor-pointer focus:outline-none"
                style={{
                  filter: showResult && !isThisSelected ? 'opacity(0.5)' : 'none',
                }}
              >
                {/* Tile SVG background */}
                <img
                  src={tileBg}
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  draggable={false}
                />

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-2">
                  {opt.image ? (
                    <img
                      src={getAssetUrl(opt.image)}
                      alt={opt.label}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-md"
                    />
                  ) : (
                    <span className="text-3xl sm:text-4xl font-extrabold text-[hsl(220,55%,25%)] font-nunito drop-shadow-sm">
                      {opt.label}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Spacer to push reinforcement bar to bottom */}
        <div className="flex-1" />

        {/* 5. Reinforcement panel / feedback bar */}
        <AnimatePresence mode="wait">
          {reinforcement && (
            <motion.div
              key={reinforcement}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="w-full"
            >
              <div
                className={`w-full rounded-3xl px-6 py-4 text-center shadow-medium ${
                  isCorrect
                    ? 'bg-gradient-to-r from-[hsl(142,70%,45%)] to-[hsl(155,65%,50%)] text-white'
                    : 'bg-gradient-to-r from-[hsl(217,85%,55%)] to-[hsl(230,75%,60%)] text-white'
                }`}
              >
                <p className="text-xl sm:text-2xl font-extrabold font-nunito tracking-wide">
                  {reinforcement}
                </p>
              </div>

              {/* Retry button for wrong answers */}
              {showResult && !isCorrect && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center mt-3"
                >
                  <button
                    onClick={handleRetry}
                    className="px-8 py-3 rounded-full bg-white/90 text-[hsl(220,55%,30%)] font-bold text-lg shadow-soft hover:shadow-medium transition-shadow active:scale-95 font-nunito"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Default bottom panel when no feedback yet */}
        {!reinforcement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="w-full rounded-3xl bg-white/30 backdrop-blur-sm px-6 py-3 text-center"
          >
            <p className="text-base font-semibold text-white/80 font-nunito">
              Tap an answer above ☝️
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TapIdentifyGame;
