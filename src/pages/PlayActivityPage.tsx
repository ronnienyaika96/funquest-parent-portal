import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Star, Trophy, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TracingGame from '@/components/games/TracingGame';
import TapIdentifyGame from '@/components/games/TapIdentifyGame';
import DragDropMatchGame from '@/components/games/DragDropMatchGame';
import StoryInteractiveGame from '@/components/games/StoryInteractiveGame';
import GameShell from '@/components/games/GameShell';

const STORAGE_BUCKET = 'game assets';

export function getAssetUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

const PlayActivityPage = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const [searchParams] = useSearchParams();
  const childId = searchParams.get('childId');
  const navigate = useNavigate();

  const [activity, setActivity] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);

  useEffect(() => {
    if (!activityId) return;
    async function load() {
      setLoading(true);
      const [actRes, stepsRes] = await Promise.all([
        supabase.from('activities').select('*').eq('id', activityId).single(),
        supabase.from('activity_steps').select('*').eq('activity_id', activityId).order('step_order', { ascending: true }),
      ]);
      if (actRes.data) setActivity(actRes.data);
      if (stepsRes.data) setSteps(stepsRes.data);
      setLoading(false);
    }
    load();
  }, [activityId]);

  useEffect(() => {
    if (!activityId || !childId || steps.length === 0) return;
    async function loadProgress() {
      const { data } = await supabase
        .from('progress')
        .select('*')
        .eq('child_id', childId)
        .eq('activity_id', activityId)
        .maybeSingle();

      if (data) {
        setProgress(data);
        setStarsEarned(data.stars_earned || 0);
        if (data.completed) {
          setCompleted(true);
          setCurrentStepIndex(steps.length - 1);
        } else {
          const idx = steps.findIndex((s: any) => s.step_order === data.current_step_order);
          setCurrentStepIndex(idx >= 0 ? idx : 0);
        }
      } else {
        const { data: newProg } = await supabase
          .from('progress')
          .insert({ child_id: childId, activity_id: activityId, current_step_order: steps[0].step_order, completed_steps: [], stars_earned: 0 })
          .select()
          .single();
        if (newProg) {
          setProgress(newProg);
          setCurrentStepIndex(0);
        }
      }
    }
    loadProgress();
  }, [activityId, childId, steps]);

  const currentStep = steps[currentStepIndex];

  const handleStepSuccess = useCallback(async () => {
    if (!progress || !childId || !activityId) return;

    const completedSteps = [...(Array.isArray(progress.completed_steps) ? progress.completed_steps : []), currentStep.id];
    const newStars = (progress.stars_earned || 0) + 1;
    const isLastStep = currentStepIndex >= steps.length - 1;
    const nextStepOrder = isLastStep ? currentStep.step_order : steps[currentStepIndex + 1].step_order;

    const updateData: any = {
      completed_steps: completedSteps,
      stars_earned: newStars,
      current_step_order: nextStepOrder,
      updated_at: new Date().toISOString(),
    };
    if (isLastStep) updateData.completed = true;

    await supabase.from('progress').update(updateData).eq('id', progress.id);

    setProgress((p: any) => ({ ...p, ...updateData }));
    setStarsEarned(newStars);

    if (isLastStep) {
      setCompleted(true);
    } else {
      setCurrentStepIndex(i => i + 1);
    }
  }, [progress, currentStep, currentStepIndex, steps, childId, activityId]);

  // --- Loading ---
  if (loading) {
    return (
      <GameShell>
        <div className="flex-1 flex items-center justify-center">
          <div className="space-y-4 w-80">
            <Skeleton className="h-10 w-52 mx-auto rounded-2xl" />
            <Skeleton className="h-72 rounded-3xl" />
          </div>
        </div>
      </GameShell>
    );
  }

  // --- Not Found ---
  if (!activity || steps.length === 0) {
    return (
      <GameShell>
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-6">
          <span className="text-6xl">🔍</span>
          <p className="text-lg font-semibold text-muted-foreground">Activity not found or has no steps.</p>
          <Button onClick={() => navigate('/activities')} className="rounded-full px-8 shadow-medium">
            Back to Activities
          </Button>
        </div>
      </GameShell>
    );
  }

  // --- Completion ---
  if (completed) {
    return (
      <GameShell>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          >
            <div className="w-28 h-28 rounded-full bg-funquest-warning/20 flex items-center justify-center shadow-glow">
              <Trophy className="w-16 h-16 text-funquest-warning" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2" style={{ lineHeight: '1.15' }}>
              🎉 Amazing Job!
            </h1>
            <p className="text-muted-foreground text-lg max-w-sm mx-auto">
              You completed <strong className="text-foreground">{activity.title}</strong> and earned{' '}
              <span className="text-funquest-warning font-bold">{starsEarned} ⭐</span>
            </p>
          </motion.div>

          {/* Star parade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-1.5"
          >
            {Array.from({ length: Math.min(starsEarned, 10) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + i * 0.08, type: 'spring', stiffness: 300 }}
              >
                <Star className="w-8 h-8 text-funquest-warning fill-funquest-warning" />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-3"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/activities')}
              className="rounded-full px-6 border-2 shadow-soft font-semibold"
            >
              More Activities
            </Button>
            <Button
              onClick={() => { setCompleted(false); setCurrentStepIndex(0); }}
              className="rounded-full px-6 shadow-medium font-semibold gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </Button>
          </motion.div>
        </div>
      </GameShell>
    );
  }

  // --- Gameplay ---
  const progressPct = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <GameShell>
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between shadow-soft">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/activities')}
            className="rounded-full w-10 h-10 hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-sm font-bold text-foreground leading-tight">{activity.title}</h1>
            <p className="text-xs text-muted-foreground">
              Step {currentStepIndex + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Stars badge */}
        <div className="flex items-center gap-1.5 bg-funquest-warning/15 border border-funquest-warning/30 rounded-full px-3 py-1.5">
          <Star className="w-4 h-4 text-funquest-warning fill-funquest-warning" />
          <span className="text-sm font-bold text-funquest-warning">{starsEarned}</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-2 bg-muted/60">
        <motion.div
          className="h-full bg-gradient-to-r from-funquest-blue to-funquest-purple rounded-r-full"
          initial={false}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 40, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -40, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg"
          >
            <GameRenderer step={currentStep} onSuccess={handleStepSuccess} />
          </motion.div>
        </AnimatePresence>
      </div>
    </GameShell>
  );
};

function GameRenderer({ step, onSuccess }: { step: any; onSuccess: () => void }) {
  const data = step.data || {};
  const gameType = step.game_type;

  if (gameType === 'tracing') {
    return <TracingGame step={step} onSuccess={onSuccess} />;
  }
  if (gameType === 'tap_identify' && data.mode === 'story_interactive') {
    return <StoryInteractiveGame step={step} onSuccess={onSuccess} />;
  }
  if (gameType === 'tap_identify' && data.mode === 'drag_drop_match') {
    return <DragDropMatchGame step={step} onSuccess={onSuccess} />;
  }
  return <TapIdentifyGame step={step} onSuccess={onSuccess} />;
}

export default PlayActivityPage;
