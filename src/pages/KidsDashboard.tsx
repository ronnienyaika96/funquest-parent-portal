
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useChildProfiles } from '@/hooks/useChildProfiles';
import KidsHeader from '@/components/kids/KidsHeader';
import GameCarousel from '@/components/kids/GameCarousel';
import LearningPathMap from '@/components/kids/LearningPathMap';
import ParentalGate from '@/components/kids/ParentalGate';
import ChildSelector from '@/components/parent/ChildSelector';
import { Skeleton } from '@/components/ui/skeleton';

const TYPE_CONFIG: Record<string, { emoji: string; subtitle: string; color: string }> = {
  letter: { emoji: '🔤', subtitle: 'Letter Fun', color: 'bg-gradient-to-br from-sky-400 to-sky-600' },
  number: { emoji: '🔢', subtitle: 'Number Play', color: 'bg-gradient-to-br from-green-400 to-green-600' },
  word: { emoji: '📝', subtitle: 'Word Builder', color: 'bg-gradient-to-br from-purple-400 to-pink-500' },
  story: { emoji: '📖', subtitle: 'Story Time', color: 'bg-gradient-to-br from-yellow-400 to-orange-500' },
  game: { emoji: '🎮', subtitle: 'Game Time', color: 'bg-gradient-to-br from-red-400 to-red-600' },
};

const FALLBACK_COLORS = [
  'bg-gradient-to-br from-pink-400 to-rose-600',
  'bg-gradient-to-br from-indigo-500 to-purple-600',
  'bg-gradient-to-br from-cyan-400 to-blue-600',
  'bg-gradient-to-br from-emerald-400 to-teal-600',
  'bg-gradient-to-br from-amber-400 to-orange-500',
];

interface ActivityWithSteps {
  id: string;
  title: string;
  type: string;
  is_published: boolean;
  step_count: number;
}

const KidsDashboard = () => {
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

  // Auto-select first child
  useEffect(() => {
    if (childProfiles && childProfiles.length > 0 && !selectedChildId) {
      setSelectedChildId(childProfiles[0].id);
    }
  }, [childProfiles, selectedChildId]);

  // Fetch activities with step counts
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

        if (actErr) { console.error('Error fetching activities:', actErr); setActivitiesError(actErr.message); setActivitiesLoading(false); return; }

        const { data: steps, error: stepErr } = await supabase
          .from('activity_steps')
          .select('activity_id');

        if (stepErr) { console.error('Error fetching activity_steps:', stepErr); setActivitiesError(stepErr.message); setActivitiesLoading(false); return; }

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
        console.error('Unexpected error fetching activities:', err);
        setActivitiesError(err?.message || 'Unknown error');
      } finally {
        setActivitiesLoading(false);
      }
    };
    fetchActivities();
  }, [user]);

  // Fetch progress for selected child
  useEffect(() => {
    if (!selectedChildId) { setProgressMap({}); return; }
    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from('progress')
        .select('activity_id, completed, current_step_order, stars_earned')
        .eq('child_id', selectedChildId);

      if (error) { console.error('Error fetching progress:', error); return; }
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

  const toGameCard = (activity: ActivityWithSteps, index: number) => {
    const config = TYPE_CONFIG[activity.type] || { emoji: '📚', subtitle: activity.type, color: FALLBACK_COLORS[index % FALLBACK_COLORS.length] };
    const prog = progressMap[activity.id];
    const progressPct = prog && !prog.completed && activity.step_count > 0
      ? Math.round(((prog.current_step_order - 1) / activity.step_count) * 100)
      : undefined;
    return {
      id: activity.id,
      title: activity.title,
      emoji: config.emoji,
      color: config.color,
      progress: progressPct,
      isNew: !prog,
    };
  };

  const handleGameClick = (activityId: string) => {
    const params = selectedChildId ? `?childId=${selectedChildId}` : '';
    navigate(`/play/${activityId}${params}`);
  };

  const handleParentalSuccess = () => navigate('/parent');

  // Log children error
  if (childrenError) console.error('Error fetching child_profiles:', childrenError);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-green-50">
      <KidsHeader
        onLearningPathClick={() => setShowLearningPath(true)}
        onGrownUpsClick={() => setShowParentalGate(true)}
        childName={childName || (childrenLoading ? '...' : 'Explorer')}
      />

      <main className="py-6 pb-24">
        {/* Child Selector */}
        {childrenLoading ? (
          <div className="px-4 sm:px-6 mb-6">
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ) : childrenError ? (
          <div className="px-4 sm:px-6 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">
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
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
              <span className="text-4xl block mb-2">👶</span>
              <p className="text-amber-800 font-medium">No child profiles found.</p>
              <p className="text-amber-600 text-sm">Add a child profile in the parent dashboard to get started.</p>
            </div>
          </div>
        ) : null}

        {/* Welcome Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-4 sm:mx-6 mb-8">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-8 text-6xl opacity-20">⭐</div>
            <div className="absolute bottom-4 right-24 text-4xl opacity-20">🌟</div>
            <div className="absolute top-8 right-32 text-3xl opacity-20">✨</div>
            <div className="relative z-10">
              <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2 drop-shadow-md">
                🎉 What shall we learn today?
              </h2>
              <p className="text-white/90 text-lg">Pick a game and start your adventure!</p>
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
            <h3 className="text-xl font-bold text-gray-700 mb-2">Something went wrong</h3>
            <p className="text-gray-500">Could not load activities. Please try refreshing the page.</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16 px-4">
            <span className="text-6xl block mb-4">🎨</span>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No activities yet!</h3>
            <p className="text-gray-500">New learning adventures are coming soon. Check back later!</p>
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
    </div>
  );
};

export default KidsDashboard;
