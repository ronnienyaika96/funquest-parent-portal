import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useChildProfiles } from '@/hooks/useChildProfiles';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Play, Star, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import ChildSelector from '@/components/parent/ChildSelector';

const ActivitiesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { children: childProfiles, isLoading: childrenLoading } = useChildProfiles();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (childProfiles && childProfiles.length > 0 && !selectedChildId) {
      setSelectedChildId(childProfiles[0].id);
    }
  }, [childProfiles, selectedChildId]);

  useEffect(() => {
    async function fetchActivities() {
      setLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      if (!error && data) setActivities(data);
      setLoading(false);
    }
    if (user) fetchActivities();
  }, [user]);

  const handlePlay = (activityId: string) => {
    if (!selectedChildId) return;
    navigate(`/play/${activityId}?childId=${selectedChildId}`);
  };

  const typeIcons: Record<string, string> = {
    letter: '🔤',
    number: '🔢',
    game: '🎮',
    story: '📖',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/play')} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Activities</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <ChildSelector
          children={(childProfiles || []).map((c: any) => ({
            id: c.id,
            name: c.name,
            avatar: c.avatar,
            age: c.age_range ? parseInt(c.age_range) : (c.age || 4),
          }))}
          selectedChildId={selectedChildId}
          onSelectChild={setSelectedChildId}
          isLoading={childrenLoading}
        />

        {!selectedChildId && !childrenLoading && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">Please add a child profile first to start playing!</p>
            <Button className="mt-4" onClick={() => navigate('/parent')}>Go to Parent Dashboard</Button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Star className="w-12 h-12 mx-auto mb-4 text-muted" />
            <p className="text-lg font-medium">No activities available yet!</p>
            <p className="text-sm">Check back soon for new learning adventures.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="p-5 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-border bg-card"
                  onClick={() => handlePlay(activity.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{typeIcons[activity.type] || '📚'}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{activity.title}</h3>
                      <p className="text-xs text-muted-foreground capitalize mt-1">
                        {activity.type} • Ages {activity.age_min || '?'}–{activity.age_max || '?'}
                      </p>
                    </div>
                    <Button size="icon" variant="ghost" className="shrink-0 text-primary hover:bg-primary/10 rounded-full">
                      <Play className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ActivitiesPage;
