import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useChildProfiles } from '@/hooks/useChildProfiles';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import KidsHeader from '@/components/kids/KidsHeader';
import GameCarousel from '@/components/kids/GameCarousel';
import LearningPathMap from '@/components/kids/LearningPathMap';
import ParentalGate from '@/components/kids/ParentalGate';
import ChildSelector from '@/components/parent/ChildSelector';
import GameShell from '@/components/games/GameShell';
import { getCategoryConfig } from '@/lib/funquest-assets';

interface ActivityWithSteps {
  id: string;
  title: string;
  type: string;
  is_published: boolean;
  step_count: number;
}

const ActivitiesPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { children: childProfiles, isLoading: childrenLoading, error: childrenError } = useChildProfiles();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [activities, setActivities] = useState<ActivityWithSteps[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, { completed: boolean; current_step_order: number; stars_earned: number }>>({});
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [showParentalGate, setShowParentalGate] = useState(false);

  useEffect(() => {
    if (childProfiles && childProfiles.length > 0 && !selectedChildId) {
      setSelectedChildId(childProfiles[0].id);
    }
  }, [childProfiles, selectedChildId]);

  useEffect(() => {
    if (!user) return;
    const fetchActivities = async () => {
      setActivitiesLoading(true);
      setActivitiesError(null);
      try {
        const { data: allActivities, error: actErr } = await supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false });

        if (actErr) { setActivitiesError(actErr.message); setActivitiesLoading(false); return; }

        const { data: steps, error: stepErr } = await supabase
          .from('activity_steps')
          .select('activity_id');

        if (stepErr) { setActivitiesError(stepErr.message); setActivitiesLoading(false); return; }

        const stepCounts: Record<string, number> = {};
        (steps || []).forEach((s: any) => {
          if (s.activity_id) stepCounts[s.activity_id] = (stepCounts[s.activity_id] || 0) + 1;
        });

        const withSteps = (allActivities || [])
          .filter((a: any) => (stepCounts[a.id] || 0) > 0)
          .map((a: any) => ({ ...a, step_count: stepCounts[a.id] || 0 }));

        const published = withSteps.filter((a: any) => a.is_published);
        setActivities(published.length > 0 ? published : withSteps);
      } catch (err: any) {
        setActivitiesError(err?.message || 'Unknown error');
      } finally {
        setActivitiesLoading(false);
      }
    };
    fetchActivities();
  }, [user]);

  useEffect(() => {
    if (!selectedChildId) { setProgressMap({}); return; }
    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from('progress')
        .select('activity_id, completed, current_step_order, stars_earned')
        .eq('child_id', selectedChildId);
      if (error) return;
      const map: Record<string, any> = {};
      (data || []).forEach((p: any) => {
        if (p.activity_id) map[p.activity_id] = { completed: p.completed, current_step_order: p.current_step_order, stars_earned: p.stars_earned };
      });
      setProgressMap(map);
    };
    fetchProgress();
  }, [selectedChildId]);

  const selectedChild = childProfiles?.find(c => c.id === selectedChildId);
  const childName = selectedChild?.name;

  const continuePlaying = selectedChildId
    ? activities.filter(a => progressMap[a.id] && !progressMap[a.id].completed)
    : [];
  const newAdventures = selectedChildId
    ? activities.filter(a => !progressMap[a.id] || progressMap[a.id].completed)
    : activities;

  const getThumbnailUrl = (title: string, type: string): string | undefined => {
    const t = title.toLowerCase();
    const fileMap: Array<{ match: RegExp; file: string }> = [
      { match: /(drag.*drop.*letter|letter.*drag.*drop|match.*letter)/, file: 'drag and drop letters.png' },
      { match: /(drag.*drop.*number|number.*drag.*drop|match.*number)/, file: 'drag and drop numbers.png' },
      { match: /letter.*tracing|trace.*letter|alphabet.*tracing/, file: 'letter tracing.png' },
      { match: /number.*tracing|trace.*number/, file: 'number tracing.png' },
      { match: /tap.*identify.*letter|identify.*letter/, file: 'tap to identify letters.png' },
      { match: /tap.*identify.*number|identify.*number/, file: 'tap to identify numbers.png' },
      { match: /drag.*drop/, file: 'drag and drop letters.png' },
    ];
    let file = fileMap.find(f => f.match.test(t))?.file;
    if (!file) {
      if (type === 'letter') file = 'letter tracing.png';
      else if (type === 'number') file = 'number tracing.png';
    }
    if (!file) return undefined;
    const { data } = supabase.storage.from('thumbnails').getPublicUrl(file);
    return data.publicUrl;
  };

  const toGameCard = (activity: ActivityWithSteps, index: number) => {
    const config = getCategoryConfig(activity.type);
    const prog = progressMap[activity.id];
    const progressPct = prog && !prog.completed && activity.step_count > 0
      ? Math.round(((prog.current_step_order - 1) / activity.step_count) * 100)
      : undefined;
    return {
      id: activity.id,
      title: activity.title,
      emoji: config.emoji,
      color: `bg-gradient-to-br ${config.gradient}`,
      progress: progressPct,
      isNew: !prog,
      thumbnail: getThumbnailUrl(activity.title, activity.type),
    };
  };

  const handleGameClick = (activityId: string) => {
    const params = selectedChildId ? `?childId=${selectedChildId}` : '';
    navigate(`/play/${activityId}${params}`);
  };

  const handleParentalSuccess = () => navigate('/parent');

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <GameShell>
      <KidsHeader
        onLearningPathClick={() => setShowLearningPath(true)}
        onGrownUpsClick={() => setShowParentalGate(true)}
        childName={childName || (childrenLoading ? '...' : 'Explorer')}
      />

      <main className="py-6 pb-24">
        {/* Child Selector */}
        {childrenLoading ? (
          <div className="px-4 sm:px-6 mb-6">
            <Skeleton className="h-20 w-full rounded-3xl" />
          </div>
        ) : childrenError ? (
          <div className="px-4 sm:px-6 mb-6">
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 text-destructive text-sm">
              Could not load child profiles. Please try refreshing.
            </div>
          </div>
        ) : childProfiles && childProfiles.length > 1 ? (
          <div className="px-4 sm:px-6 mb-6">
            <ChildSelector
              children={(childProfiles || []).map((c: any) => ({
                id: c.id,
                name: c.name,
                avatar: c.avatar,
                age: c.age || 4,
              }))}
              selectedChildId={selectedChildId}
              onSelectChild={setSelectedChildId}
              isLoading={childrenLoading}
            />
          </div>
        ) : childProfiles && childProfiles.length === 0 ? (
          <div className="px-4 sm:px-6 mb-6">
            <div className="bg-card border border-border rounded-3xl p-8 text-center shadow-soft">
              <span className="text-5xl block mb-3">👶</span>
              <p className="text-foreground font-bold text-lg mb-1">No child profiles found</p>
              <p className="text-muted-foreground text-sm">Add a child in the parent dashboard to get started.</p>
            </div>
          </div>
        ) : null}

        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-4 sm:mx-6 mb-8"
        >
          <div className="bg-gradient-to-r from-funquest-purple via-funquest-pink to-funquest-orange rounded-3xl p-6 sm:p-8 shadow-strong relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-3 right-6 w-16 h-16 bg-white/8 rounded-full blur-sm" />
            <div className="absolute bottom-2 right-20 w-10 h-10 bg-white/6 rounded-full blur-sm" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm items-center justify-center flex-shrink-0">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white text-2xl sm:text-3xl font-bold mb-1 drop-shadow-md" style={{ lineHeight: '1.2' }}>
                  What shall we learn today?
                </h1>
                <p className="text-white/80 text-base sm:text-lg">Pick a game and start your adventure!</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activities */}
        {activitiesLoading ? (
          <div className="px-4 sm:px-6 space-y-6">
            <Skeleton className="h-8 w-48 rounded-full" />
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="w-[200px] h-[240px] rounded-3xl flex-shrink-0" />
              ))}
            </div>
          </div>
        ) : activitiesError ? (
          <div className="text-center py-16 px-4">
            <span className="text-6xl block mb-4">⚠️</span>
            <h3 className="text-xl font-bold text-foreground mb-2">Something went wrong</h3>
            <p className="text-muted-foreground">Could not load activities. Please try refreshing.</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16 px-4">
            <span className="text-6xl block mb-4">🎨</span>
            <h3 className="text-xl font-bold text-foreground mb-2">No activities yet!</h3>
            <p className="text-muted-foreground">New learning adventures are coming soon.</p>
          </div>
        ) : (
          <>
            {continuePlaying.length > 0 && (
              <GameCarousel
                title="Continue Playing"
                titleEmoji="🎮"
                games={continuePlaying.map(toGameCard)}
                onGameClick={handleGameClick}
              />
            )}
            {newAdventures.length > 0 && (
              <GameCarousel
                title={continuePlaying.length > 0 ? 'New Adventures' : 'All Adventures'}
                titleEmoji="✨"
                games={newAdventures.map(toGameCard)}
                onGameClick={handleGameClick}
              />
            )}
          </>
        )}
      </main>

      <LearningPathMap
        isOpen={showLearningPath}
        onClose={() => setShowLearningPath(false)}
        onLevelClick={() => setShowLearningPath(false)}
      />
      <ParentalGate
        isOpen={showParentalGate}
        onClose={() => setShowParentalGate(false)}
        onSuccess={handleParentalSuccess}
      />
    </GameShell>
  );
};

export default ActivitiesPage;
