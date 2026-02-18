import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalActivities: number;
  publishedActivities: number;
  draftActivities: number;
  totalParents: number;
  totalChildren: number;
  totalPlays: number;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  type: string;
  is_published: boolean | null;
  created_at: string | null;
}

export function useAdminStats() {
  const stats = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      const [activitiesRes, profilesRes, childrenRes, progressRes] = await Promise.all([
        (supabase as any).from('activities').select('id, is_published'),
        (supabase as any).from('profiles').select('id', { count: 'exact', head: true }),
        (supabase as any).from('child_profiles').select('id', { count: 'exact', head: true }),
        (supabase as any).from('progress').select('id', { count: 'exact', head: true }),
      ]);

      const activities = activitiesRes.data || [];
      return {
        totalActivities: activities.length,
        publishedActivities: activities.filter((a: any) => a.is_published).length,
        draftActivities: activities.filter((a: any) => !a.is_published).length,
        totalParents: profilesRes.count ?? 0,
        totalChildren: childrenRes.count ?? 0,
        totalPlays: progressRes.count ?? 0,
      };
    },
  });

  const recentActivity = useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async (): Promise<RecentActivityItem[]> => {
      const { data, error } = await (supabase as any)
        .from('activities')
        .select('id, title, type, is_published, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return (data || []) as RecentActivityItem[];
    },
  });

  return {
    stats: stats.data,
    statsLoading: stats.isLoading,
    recentActivity: recentActivity.data || [],
    recentLoading: recentActivity.isLoading,
  };
}
