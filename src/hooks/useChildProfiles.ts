import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ChildProfile {
  id: string;
  parent_id: string | null;
  name: string;
  age: number;
  avatar: string | null;
  created_at: string | null;
}

export function useChildProfiles() {
  const queryClient = useQueryClient();

  const {
    data: children,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['child_profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('child_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('[useChildProfiles] fetch error:', error);
        throw error;
      }
      return (data || []) as ChildProfile[];
    },
  });

  const addChild = useMutation({
    mutationFn: async (profile: { name: string; age: number; avatar?: string | null }) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user || !user.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('child_profiles')
        .insert([{
          name: profile.name,
          age: profile.age,
          avatar: profile.avatar || '🦁',
          parent_id: user.id,
        }])
        .select();
      if (error) {
        console.error('[useChildProfiles] insert error:', error);
        throw error;
      }
      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child_profiles'] });
    },
  });

  const deleteChild = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('child_profiles').delete().eq('id', id);
      if (error) {
        console.error('[useChildProfiles] delete error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child_profiles'] });
    },
  });

  return { children, isLoading, error, addChild, deleteChild };
}
