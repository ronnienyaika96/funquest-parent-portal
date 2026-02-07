import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ChildProfile {
  id: string;
  parent_id: string;
  name: string;
  age_range: string | null;
  avatar: string | null;
  school: string | null;
  interests: string[] | null;
  created_at: string;
  updated_at: string;
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
      const { data, error } = await (supabase as any)
        .from('child_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as ChildProfile[];
    },
  });

  const addChild = useMutation({
    mutationFn: async (profile: Omit<ChildProfile, 'id' | 'created_at' | 'updated_at' | 'parent_id'>) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user || !user.id) throw new Error('User not authenticated');

      const { data, error } = await (supabase as any)
        .from('child_profiles')
        .insert([{ ...profile, parent_id: user.id }])
        .select();
      if (error) throw error;
      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child_profiles'] });
    }
  });

  const deleteChild = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('child_profiles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child_profiles'] });
    }
  });

  return { children, isLoading, error, addChild, deleteChild };
}
