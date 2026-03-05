import React, { useState, useEffect } from 'react';
import { getAssetUrl } from '@/pages/PlayActivityPage';
import { motion } from 'framer-motion';
import { CheckCircle, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DragDropMatchGameProps {
  step: any;
  onSuccess: () => void;
}

interface MatchPair {
  id: string;
  source: { label: string; image?: string };
  target: { label: string; image?: string };
}

const DragDropMatchGame: React.FC<DragDropMatchGameProps> = ({ step, onSuccess }) => {
  const data = step.data || {};
  const instruction = data.instruction || 'Match the items!';
  const pairs: MatchPair[] = (data.pairs || []).map((p: any, i: number) => ({ ...p, id: p.id || `p${i}` }));
  const instructionAudio = step.instruction_audio_url;

  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [wrongPair, setWrongPair] = useState<string | null>(null);

  // Shuffle targets
  const [shuffledTargets] = useState(() => [...pairs].sort(() => Math.random() - 0.5));

  useEffect(() => {
    if (instructionAudio) {
      new Audio(getAssetUrl(instructionAudio)).play().catch(() => {});
    }
  }, [instructionAudio]);

  const allMatched = Object.keys(matches).length === pairs.length;

  useEffect(() => {
    if (allMatched && pairs.length > 0) {
      setTimeout(onSuccess, 1000);
    }
  }, [allMatched, pairs.length, onSuccess]);

  const handleSourceTap = (pairId: string) => {
    if (matches[pairId]) return;
    setSelectedSource(pairId);
    setWrongPair(null);
  };

  const handleTargetTap = (pairId: string) => {
    if (!selectedSource) return;
    if (selectedSource === pairId) {
      // Correct match
      setMatches(m => ({ ...m, [pairId]: pairId }));
      setSelectedSource(null);
    } else {
      // Wrong
      setWrongPair(pairId);
      setTimeout(() => { setWrongPair(null); setSelectedSource(null); }, 600);
    }
  };

  const handleReset = () => {
    setMatches({});
    setSelectedSource(null);
    setWrongPair(null);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-2">
        <p className="text-lg font-bold text-foreground text-center">{instruction}</p>
        {instructionAudio && (
          <button onClick={() => new Audio(getAssetUrl(instructionAudio)).play().catch(() => {})} className="text-primary">
            <Volume2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex gap-8 w-full max-w-md justify-center">
        {/* Sources */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-muted-foreground text-center">Items</p>
          {pairs.map(pair => {
            const matched = !!matches[pair.id];
            const isSelected = selectedSource === pair.id;
            return (
              <motion.button
                key={pair.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSourceTap(pair.id)}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 min-w-[80px] ${
                  matched ? 'border-green-400 bg-green-50 opacity-60' :
                  isSelected ? 'border-primary bg-primary/10 shadow-md' :
                  'border-border bg-card hover:shadow-sm'
                }`}
                disabled={matched}
              >
                {pair.source.image && (
                  <img src={getAssetUrl(pair.source.image)} alt={pair.source.label} className="w-12 h-12 object-contain" />
                )}
                <span className="text-sm font-medium text-foreground">{pair.source.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Targets */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-muted-foreground text-center">Match</p>
          {shuffledTargets.map(pair => {
            const matched = !!matches[pair.id];
            const isWrong = wrongPair === pair.id;
            return (
              <motion.button
                key={pair.id}
                whileTap={{ scale: 0.95 }}
                animate={isWrong ? { x: [0, -8, 8, -4, 4, 0] } : {}}
                onClick={() => handleTargetTap(pair.id)}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 min-w-[80px] ${
                  matched ? 'border-green-400 bg-green-50 opacity-60' :
                  isWrong ? 'border-red-400 bg-red-50' :
                  'border-border bg-card hover:shadow-sm'
                }`}
                disabled={matched}
              >
                {pair.target.image && (
                  <img src={getAssetUrl(pair.target.image)} alt={pair.target.label} className="w-12 h-12 object-contain" />
                )}
                <span className="text-sm font-medium text-foreground">{pair.target.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {allMatched && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-green-600 font-bold text-lg">
          <CheckCircle className="w-6 h-6" /> All matched! 🎉
        </motion.div>
      )}

      {!allMatched && Object.keys(matches).length > 0 && (
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-1" /> Reset
        </Button>
      )}
    </div>
  );
};

export default DragDropMatchGame;
