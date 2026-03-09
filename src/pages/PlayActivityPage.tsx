import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Star, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TracingGame from '@/components/games/TracingGame';
import TapIdentifyGame from '@/components/games/TapIdentifyGame';
import DragDropMatchGame from '@/components/games/DragDropMatchGame';
import StoryInteractiveGame from '@/components/games/StoryInteractiveGame';

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

  // Fetch activity + steps
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

  // Fetch or create progress
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
        // Create new progress row
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="space-y-4 w-80">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!activity || steps.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">Activity not found or has no steps.</p>
        <Button onClick={() => navigate('/activities')}>Back to Activities</Button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-sky-50 to-white flex flex-col items-center justify-center gap-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <Trophy className="w-20 h-20 text-yellow-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground">🎉 Amazing Job!</h1>
        <p className="text-muted-foreground text-center max-w-sm">
          You completed <strong>{activity.title}</strong> and earned {starsEarned} ⭐!
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/activities')}>More Activities</Button>
          <Button onClick={() => { setCompleted(false); setCurrentStepIndex(0); }}>Play Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/activities')} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-sm font-bold text-foreground">{activity.title}</h1>
            <p className="text-xs text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-bold">{starsEarned}</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted">
        <motion.div
          className="h-full bg-primary rounded-r-full"
          initial={false}
          animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg"
          >
            <GameRenderer step={currentStep} onSuccess={handleStepSuccess} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
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
