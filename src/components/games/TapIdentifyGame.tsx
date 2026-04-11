import React, { useState, useEffect, useMemo } from 'react';
import { getAssetUrl } from '@/pages/PlayActivityPage';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { getChoiceAssetByState, TileState } from '@/lib/gameAssets';
import { getInstructionText, resolveOptionAsset, extractLabel, choicesMatch } from '@/lib/gameHelpers';

interface TapIdentifyGameProps {
  step: any;
  onSuccess: () => void;
}

const Cloud: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute rounded-full pointer-events-none ${className}`}
    style={{ background: 'rgba(255,255,255,0.18)' }} />
);

const TapIdentifyGame: React.FC<TapIdentifyGameProps> = ({ step, onSuccess }) => {
  const data = step.data || {};
  const question = getInstructionText(data);

  const rawOptions: any[] = Array.isArray(data.choices) ? data.choices
    : Array.isArray(data.options) ? data.options
    : Array.isArray(data.answers) ? data.answers
    : [];
  const answer = data.answer;
  const options = rawOptions.map((opt: any) => ({
    label: extractLabel(opt),
    image: opt?.image,
    correct: choicesMatch(opt, answer),
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

  const labelColors = ['#3B82F6', '#EC4899', '#22C55E', '#F59E0B', '#8B5CF6', '#EF4444'];

  return (
    <div
      className="relative w-full flex flex-col items-center overflow-visible"
      style={{
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      {/* Clouds */}
      <Cloud className="w-48 h-14 top-[6%] left-[3%] blur-md rounded-[50px]" />
      <Cloud className="w-64 h-16 top-[4%] right-[1%] blur-lg rounded-[60px]" />
      <Cloud className="w-36 h-10 top-[18%] left-[55%] blur-md rounded-[40px]" />
      <Cloud className="w-56 h-14 top-[45%] left-[-3%] blur-lg rounded-[50px]" />
      <Cloud className="w-40 h-12 bottom-[35%] right-[8%] blur-md rounded-[45px]" />
      <Cloud className="w-72 h-16 bottom-[8%] left-[15%] blur-lg rounded-[60px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 sm:px-8 pt-6 pb-4 gap-3 flex-1">

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white text-center tracking-wide"
          style={{
            textShadow: '0 2px 6px rgba(0,0,0,0.10)',
            fontFamily: "'Nunito', 'Comic Sans MS', cursive, sans-serif",
          }}
        >
          Tap to Identify
        </motion.h1>

        {/* Instruction pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-2xl rounded-full px-8 sm:px-12 py-4 flex items-center justify-center gap-4"
          style={{
            background: 'rgba(173, 216, 240, 0.55)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <p
            className="text-center text-lg sm:text-xl md:text-2xl font-bold leading-snug"
            style={{ color: '#2C5F7C', fontFamily: "'Nunito', sans-serif" }}
          >
            {question}
          </p>
          {instructionAudio && (
            <button
              onClick={playAudio}
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90"
              style={{ background: 'rgba(255,255,255,0.5)' }}
            >
              <Volume2 className="w-4 h-4" style={{ color: '#2C5F7C' }} />
            </button>
          )}
        </motion.div>

        {/* Prompt image area */}
        {data.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-center w-full py-2"
          >
            <img
              src={getAssetUrl(data.image)}
              alt="Question prompt"
              className="max-w-[85%] max-h-[200px] sm:max-h-[260px] object-contain drop-shadow-lg"
            />
          </motion.div>
        )}
        {!data.image && <div className="min-h-[8px]" />}

        {/* Answer tiles */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <div className="flex justify-center items-center gap-12 md:gap-16 lg:gap-20 px-6 mb-[-12px] relative z-10 overflow-x-auto scroll-smooth max-w-none w-full">
            {options.map((opt, i) => {
              const state = getTileState(i);
              const tileBg = tileUrls[state];
              const isThisSelected = selected === i;
              const isThisCorrect = showResult && isThisSelected && opt.correct;
              const isThisWrong = showResult && isThisSelected && !opt.correct;

              const assetUrl = opt.image ? getAssetUrl(opt.image) : resolveOptionAsset(opt.label);

              const tileSize = 420;

              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.06 }}
                  animate={
                    isThisCorrect
                      ? { scale: [1, 1.15, 1.05], transition: { duration: 0.4 } }
                      : isThisWrong
                      ? { x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4 } }
                      : {}
                  }
                  onClick={() => handleTap(i)}
                  className="relative cursor-pointer focus:outline-none flex-shrink-0 aspect-square"
                  style={{
                    width: tileSize,
                    height: tileSize,
                    filter: showResult && !isThisSelected ? 'opacity(0.4)' : 'none',
                    transition: 'filter 0.3s ease',
                  }}
                >
                  <img
                    src={tileBg}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    draggable={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
                    {assetUrl ? (
                      <img
                        src={assetUrl}
                        alt={opt.label}
                        className="w-[75%] h-[75%] object-contain drop-shadow-md"
                      />
                    ) : (
                      <span
                        className="font-extrabold drop-shadow-sm select-none"
                        style={{
                          fontSize: `${Math.max(tileSize * 0.45, 48)}px`,
                          color: labelColors[i % labelColors.length],
                          fontFamily: "'Nunito', 'Comic Sans MS', cursive, sans-serif",
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

          {/* Shelf */}
          <div
            className="w-full h-16 sm:h-20"
            style={{
              background: 'linear-gradient(180deg, #4A8DBF 0%, #3A6F9A 100%)',
              borderRadius: '0 0 1.5rem 1.5rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            }}
          />
        </motion.div>

        {/* Feedback bar */}
        <AnimatePresence mode="wait">
          {reinforcement && (
            <motion.div
              key={reinforcement}
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              className="w-full mt-2 mb-6"
            >
              <div
                className="w-full max-w-3xl mx-auto rounded-2xl px-8 py-5 flex items-center justify-center gap-4"
                style={{
                  background: isCorrect
                    ? 'linear-gradient(135deg, #34D399, #10B981)'
                    : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.10)',
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
                    className="px-8 py-2.5 rounded-full bg-white/90 font-bold text-base shadow-md hover:shadow-lg transition-shadow active:scale-95"
                    style={{ color: '#2C5F7C', fontFamily: "'Nunito', sans-serif" }}
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
