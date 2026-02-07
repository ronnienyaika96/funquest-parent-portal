import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TracingProgress {
  id: string;
  user_id: string;
  letter: string;
  completed: boolean;
  score: number;
  attempts: number;
  last_traced: string;
  created_at: string;
  updated_at: string;
}

export function useTracingProgress(letter?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: progress,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tracing_progress', user?.id, letter],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      let query = (supabase as any)
        .from('tracing_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (letter) {
        query = query.eq('letter', letter);
      }
      
      const { data, error } = await query.order('last_traced', { ascending: false });
      
      if (error) throw error;
      return (data || []) as TracingProgress[];
    },
    enabled: !!user?.id,
  });

  const saveProgress = useMutation({
    mutationFn: async ({
      letter,
      completed,
      score,
    }: {
      letter: string;
      completed: boolean;
      score: number;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const existingProgress = progress?.find(p => p.letter === letter);
      
      if (existingProgress) {
        const { data, error } = await (supabase as any)
          .from('tracing_progress')
          .update({
            completed,
            score: Math.max(score, existingProgress.score),
            attempts: existingProgress.attempts + 1,
            last_traced: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingProgress.id)
          .select();
        
        if (error) throw error;
        return data?.[0];
      } else {
        const { data, error } = await (supabase as any)
          .from('tracing_progress')
          .insert({
            user_id: user.id,
            letter,
            completed,
            score,
            attempts: 1,
            last_traced: new Date().toISOString(),
          })
          .select();
        
        if (error) throw error;
        return data?.[0];
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracing_progress'] });
    },
  });

  const getProgressStats = () => {
    if (!progress) return { completed: 0, total: 26, percentage: 0 };
    const completed = progress.filter(p => p.completed).length;
    const total = 26;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  };

  const getLetterProgress = (letter: string) => {
    return progress?.find(p => p.letter.toLowerCase() === letter.toLowerCase());
  };

  return {
    progress,
    isLoading,
    error,
    saveProgress,
    getProgressStats,
    getLetterProgress,
  };
}
