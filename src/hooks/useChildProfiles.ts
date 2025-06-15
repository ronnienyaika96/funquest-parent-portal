
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

  // Fetch all children for the current user
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
      if (error) throw error;
      return data || [];
    },
  });

  // Add child profile
  const addChild = useMutation({
    mutationFn: async (profile: Omit<ChildProfile, 'id' | 'created_at' | 'updated_at' | 'parent_id'>) => {
      // Supabase RLS requires parent_id = auth.uid()
      const { data, error } = await supabase
        .from('child_profiles')
        .insert([{ ...profile }])
        .select();
      if (error) throw error;
      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child_profiles'] });
    }
  });

  // Delete child profile
  const deleteChild = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('child_profiles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child_profiles'] });
    }
  });

  return { children, isLoading, error, addChild, deleteChild };
}
