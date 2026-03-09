import React, { useState } from 'react';
import { getAssetUrl } from '@/pages/PlayActivityPage';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ChevronRight, CheckCircle, XCircle, Trophy, BookOpen } from 'lucide-react';

interface StoryInteractiveGameProps {
  step: any;
  onSuccess: () => void;
}

interface Hotspot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  correct?: boolean;
}

interface Choice {
  label: string;
  image?: string;
  correct?: boolean;
}

const StoryInteractiveGame: React.FC<StoryInteractiveGameProps> = ({ step, onSuccess }) => {
  const data = step.data || {};
  const pageType: string = data.page_type || 'story';

  switch (pageType) {
    case 'story':
      return <StoryPage data={data} onNext={onSuccess} />;
    case 'tap_object':
      return <TapObjectPage data={data} onSuccess={onSuccess} />;
    case 'question':
      return <QuestionPage data={data} onSuccess={onSuccess} />;
    case 'ending':
      return <EndingPage data={data} onNext={onSuccess} />;
    default:
      return <StoryPage data={data} onNext={onSuccess} />;
  }
};

function NarrationButton({ url }: { url?: string | null }) {
  if (!url) return null;
  const play = () => new Audio(getAssetUrl(url)).play().catch(() => {});
  return (
    <Button variant="outline" size="sm" onClick={play} className="gap-2 rounded-full">
      <Volume2 className="w-4 h-4" />
      Listen
    </Button>
  );
}

function StoryPage({ data, onNext }: { data: any; onNext: () => void }) {
  const title = data.page_title || '';
  const text = data.story_text || 'Once upon a time…';
  const illustration = data.illustration;
  const narration = data.narration_audio;
  const showNext = data.show_next !== false;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {title && <h2 className="text-2xl font-bold text-foreground text-center">{title}</h2>}

      {illustration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden border-2 border-border bg-muted"
        >
          <img src={getAssetUrl(illustration)} alt="Story illustration" className="w-full h-full object-contain" />
        </motion.div>
      )}
      {!illustration && (
        <div className="w-full max-w-sm aspect-square rounded-2xl border-2 border-dashed border-border bg-muted/50 flex items-center justify-center">
          <BookOpen className="w-16 h-16 text-muted-foreground/40" />
        </div>
      )}

      <p className="text-lg text-foreground text-center leading-relaxed max-w-md">{text}</p>

      <div className="flex items-center gap-3">
        <NarrationButton url={narration} />
        {showNext && (
          <Button onClick={onNext} className="gap-2 rounded-full px-6">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function TapObjectPage({ data, onSuccess }: { data: any; onSuccess: () => void }) {
  const instruction = data.instruction || 'Tap the right object!';
  const illustration = data.illustration;
  const hotspots: Hotspot[] = data.hotspots || [];
  const [tapped, setTapped] = useState<string | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);

  const handleTap = (hs: Hotspot) => {
    if (tapped) return;
    setTapped(hs.id);
    const isCorrect = hs.correct !== false;
    setCorrect(isCorrect);
    if (isCorrect) setTimeout(onSuccess, 800);
  };

  const retry = () => { setTapped(null); setCorrect(null); };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <p className="text-xl font-bold text-foreground text-center">{instruction}</p>

      <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border-2 border-border bg-muted">
        {illustration ? (
          <img src={getAssetUrl(illustration)} alt="Scene" className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-muted-foreground/40" />
          </div>
        )}
        {hotspots.map((hs) => (
          <motion.button
            key={hs.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleTap(hs)}
            className={`absolute rounded-xl border-2 transition-colors ${
              tapped === hs.id
                ? correct
                  ? 'border-green-500 bg-green-500/20'
                  : 'border-red-400 bg-red-400/20'
                : 'border-transparent hover:border-primary/40 hover:bg-primary/10'
            }`}
            style={{
              left: `${hs.x}%`,
              top: `${hs.y}%`,
              width: `${hs.width}%`,
              height: `${hs.height}%`,
            }}
            title={hs.label}
          />
        ))}
      </div>

      <AnimatePresence>
        {tapped && correct === false && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-destructive font-bold">
              <XCircle className="w-5 h-5" /> Not quite!
            </div>
            <Button variant="outline" size="sm" onClick={retry}>Try Again</Button>
          </motion.div>
        )}
        {tapped && correct === true && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-green-600 font-bold">
            <CheckCircle className="w-5 h-5" /> Great job! 🌟
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuestionPage({ data, onSuccess }: { data: any; onSuccess: () => void }) {
  const question = data.instruction || data.question || 'Pick the right answer!';
  const choices: Choice[] = data.choices || [];
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handlePick = (i: number) => {
    if (showResult) return;
    setSelected(i);
    setShowResult(true);
    if (choices[i]?.correct) setTimeout(onSuccess, 1000);
  };

  const retry = () => { setSelected(null); setShowResult(false); };
  const isCorrect = selected !== null && choices[selected]?.correct;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-xl font-bold text-foreground text-center">{question}</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {choices.map((c, i) => {
          const isSel = selected === i;
          let cls = 'border-border';
          if (showResult && isSel) {
            cls = c.correct ? 'border-green-500 bg-green-50' : 'border-red-400 bg-red-50';
          }
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePick(i)}
              className={`p-5 rounded-2xl border-2 ${cls} bg-card transition-all flex flex-col items-center gap-2 hover:shadow-md`}
            >
              {c.image && <img src={getAssetUrl(c.image)} alt={c.label} className="w-14 h-14 object-contain" />}
              <span className="font-semibold text-foreground">{c.label}</span>
            </motion.button>
          );
        })}
      </div>

      {showResult && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-2">
          {isCorrect ? (
            <div className="flex items-center gap-2 text-green-600 font-bold">
              <CheckCircle className="w-6 h-6" /> Correct! 🌟
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-destructive font-bold">
                <XCircle className="w-6 h-6" /> Not quite!
              </div>
              <Button variant="outline" size="sm" onClick={retry}>Try Again</Button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}

function EndingPage({ data, onNext }: { data: any; onNext: () => void }) {
  const title = data.page_title || '🎉 The End!';
  const text = data.story_text || 'Great job finishing this story!';
  const illustration = data.illustration;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <Trophy className="w-16 h-16 text-yellow-500" />
      </motion.div>
      <h2 className="text-2xl font-bold text-foreground text-center">{title}</h2>
      {illustration && (
        <img src={getAssetUrl(illustration)} alt="Ending" className="w-48 h-48 object-contain rounded-2xl" />
      )}
      <p className="text-lg text-muted-foreground text-center max-w-md">{text}</p>
      <Button onClick={onNext} className="rounded-full px-8">Finish ✨</Button>
    </div>
  );
}

export default StoryInteractiveGame;
