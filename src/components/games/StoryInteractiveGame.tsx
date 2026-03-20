import React, { useState } from 'react';
import { getAssetUrl } from '@/pages/PlayActivityPage';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ChevronRight, Trophy, BookOpen } from 'lucide-react';
import { getGameAssetUrl, TILE_ASSETS } from '@/lib/funquest-assets';
import FeedbackOverlay from './FeedbackOverlay';

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
    <Button
      variant="outline"
      size="sm"
      onClick={play}
      className="gap-2 rounded-full border-2 border-funquest-blue/30 text-funquest-blue hover:bg-funquest-blue/10 font-semibold"
    >
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
      {title && (
        <h2 className="text-2xl font-bold text-foreground text-center" style={{ lineHeight: '1.2' }}>
          {title}
        </h2>
      )}

      {/* Illustration */}
      <div className="w-full max-w-sm">
        {illustration ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-3xl overflow-hidden border-2 border-border/50 bg-card shadow-medium"
          >
            <img src={getAssetUrl(illustration)} alt="Story illustration" className="w-full h-full object-contain" />
          </motion.div>
        ) : (
          <div className="aspect-square rounded-3xl border-2 border-dashed border-border bg-muted/30 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Story text */}
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl px-5 py-4 shadow-soft max-w-md">
        <p className="text-lg text-foreground text-center leading-relaxed">{text}</p>
      </div>

      <div className="flex items-center gap-3">
        <NarrationButton url={narration} />
        {showNext && (
          <Button onClick={onNext} className="gap-2 rounded-full px-6 shadow-medium font-semibold">
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
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl px-5 py-3 shadow-soft">
        <p className="text-xl font-bold text-foreground text-center">{instruction}</p>
      </div>

      <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden border-2 border-border/50 bg-card shadow-medium">
        {illustration ? (
          <img src={getAssetUrl(illustration)} alt="Scene" className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        {hotspots.map((hs) => (
          <motion.button
            key={hs.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleTap(hs)}
            className={`absolute rounded-2xl border-2 transition-colors ${
              tapped === hs.id
                ? correct
                  ? 'border-funquest-success bg-funquest-success/20'
                  : 'border-funquest-error bg-funquest-error/20'
                : 'border-transparent hover:border-primary/30 hover:bg-primary/10'
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

      <FeedbackOverlay
        show={tapped !== null}
        correct={correct}
        onRetry={correct === false ? retry : undefined}
      />
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

  const getTileBg = (index: number) => {
    if (!showResult || selected !== index) return getGameAssetUrl(TILE_ASSETS.choiceDefault);
    return choices[index]?.correct
      ? getGameAssetUrl(TILE_ASSETS.choiceCorrect)
      : getGameAssetUrl(TILE_ASSETS.choiceWrong);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl px-5 py-3 shadow-soft">
        <p className="text-xl font-bold text-foreground text-center">{question}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {choices.map((c, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.93 }}
            onClick={() => handlePick(i)}
            className="relative rounded-3xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow aspect-square"
            style={{
              backgroundImage: `url(${getTileBg(i)})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3">
              {c.image && <img src={getAssetUrl(c.image)} alt={c.label} className="w-14 h-14 object-contain drop-shadow-md" />}
              <span className="font-bold text-foreground text-sm">{c.label}</span>
            </div>
          </motion.button>
        ))}
      </div>

      <FeedbackOverlay
        show={showResult}
        correct={isCorrect ?? null}
        onRetry={!isCorrect ? retry : undefined}
      />
    </div>
  );
}

function EndingPage({ data, onNext }: { data: any; onNext: () => void }) {
  const title = data.page_title || '🎉 The End!';
  const text = data.story_text || 'Great job finishing this story!';
  const illustration = data.illustration;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
      >
        <div className="w-24 h-24 rounded-full bg-funquest-warning/20 flex items-center justify-center shadow-glow">
          <Trophy className="w-14 h-14 text-funquest-warning" />
        </div>
      </motion.div>

      <h2 className="text-2xl font-bold text-foreground text-center" style={{ lineHeight: '1.2' }}>
        {title}
      </h2>

      {illustration && (
        <div className="w-48 h-48 rounded-3xl overflow-hidden border-2 border-border/50 shadow-soft">
          <img src={getAssetUrl(illustration)} alt="Ending" className="w-full h-full object-contain" />
        </div>
      )}

      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl px-5 py-4 shadow-soft max-w-md">
        <p className="text-lg text-muted-foreground text-center">{text}</p>
      </div>

      <Button onClick={onNext} className="rounded-full px-8 shadow-medium font-semibold">
        Finish ✨
      </Button>
    </div>
  );
}

export default StoryInteractiveGame;
