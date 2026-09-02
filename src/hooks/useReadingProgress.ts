import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ReadingProgressRow {
  id: string;
  child_id: string;
  book_id: string;
  current_page: number;
  pages_completed: number;
  completed: boolean;
  stars_earned: number;
  last_read_at: string;
}

/** Reading progress for one child across all books (library view). */
export function useChildReadingProgress(childId: string | null) {
  const [map, setMap] = useState<Record<string, ReadingProgressRow>>({});
  const [loading, setLoading] = useState(!!childId);

  const load = useCallback(async () => {
    if (!childId) {
      setMap({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('child_id', childId);
    if (!error) {
      const next: Record<string, ReadingProgressRow> = {};
      (data || []).forEach((r: any) => (next[r.book_id] = r));
      setMap(next);
    }
    setLoading(false);
  }, [childId]);

  useEffect(() => {
    load();
  }, [load]);

  return { progressMap: map, loading, reload: load };
}

/** Reading progress for a single book, with a save helper. */
export function useBookReadingProgress(childId: string | null, bookId: string | undefined) {
  const [progress, setProgress] = useState<ReadingProgressRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!childId || !bookId) {
        setProgress(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data } = await supabase
        .from('reading_progress')
        .select('*')
        .eq('child_id', childId)
        .eq('book_id', bookId)
        .maybeSingle();
      if (!cancelled) {
        setProgress((data as ReadingProgressRow) || null);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [childId, bookId]);

  const save = useCallback(
    async (patch: { current_page?: number; pages_completed?: number; completed?: boolean; stars_earned?: number }) => {
      if (!childId || !bookId) return;
      const row = {
        child_id: childId,
        book_id: bookId,
        current_page: patch.current_page ?? progress?.current_page ?? 1,
        pages_completed: Math.max(patch.pages_completed ?? 0, progress?.pages_completed ?? 0),
        completed: patch.completed ?? progress?.completed ?? false,
        stars_earned: Math.max(patch.stars_earned ?? 0, progress?.stars_earned ?? 0),
        last_read_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from('reading_progress')
        .upsert(row, { onConflict: 'child_id,book_id' })
        .select()
        .maybeSingle();
      if (error) {
        console.error('[useBookReadingProgress] save failed', error);
        return;
      }
      if (data) setProgress(data as ReadingProgressRow);
    },
    [childId, bookId, progress],
  );

  return { progress, loading, save };
}
