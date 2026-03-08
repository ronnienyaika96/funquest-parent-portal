import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ActivityStep {
  id: string;
  activity_id: string | null;
  step_order: number;
  game_type: string;
  data: Record<string, any>;
  instruction_audio_url: string | null;
  created_at: string | null;
}

export interface Activity {
  id: string;
  title: string;
  type: string;
  value: string | null;
  age_min: number | null;
  age_max: number | null;
  is_published: boolean;
  created_at: string | null;
  steps: ActivityStep[];
}

export interface CreateActivityInput {
  title: string;
  type: string;
  value?: string;
  age_min?: number | null;
  age_max?: number | null;
  is_published?: boolean;
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();

  // Check admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) { setIsAdmin(false); return; }
      const { data, error } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      setIsAdmin(!error && data === true);
    };
    checkAdmin();
  }, [user]);

  // Fetch activities with their steps
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const { data: acts, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch all steps
      const { data: steps, error: stepsError } = await supabase
        .from('activity_steps')
        .select('*')
        .order('step_order', { ascending: true });

      if (stepsError) throw stepsError;

      const stepsByActivity = (steps || []).reduce((acc: Record<string, ActivityStep[]>, step: any) => {
        const aid = step.activity_id;
        if (!acc[aid]) acc[aid] = [];
        acc[aid].push(step);
        return acc;
      }, {});

      const mapped: Activity[] = (acts || []).map((a: any) => ({
        id: a.id,
        title: a.title,
        type: a.type,
        value: a.value,
        age_min: a.age_min,
        age_max: a.age_max,
        is_published: a.is_published ?? false,
        created_at: a.created_at,
        steps: stepsByActivity[a.id] || [],
      }));

      setActivities(mapped);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) fetchActivities();
  }, [isAdmin, fetchActivities]);

  const createActivity = async (input: CreateActivityInput) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          title: input.title,
          type: input.type,
          value: input.value || null,
          age_min: input.age_min ?? null,
          age_max: input.age_max ?? null,
          is_published: input.is_published ?? false,
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Activity created successfully');
      await fetchActivities();
      return data;
    } catch (error: any) {
      console.error('Error creating activity:', error);
      toast.error(error.message || 'Failed to create activity');
      return null;
    }
  };

  const updateActivity = async (id: string, updates: Partial<CreateActivityInput>) => {
    try {
      const dbUpdates: Record<string, any> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.value !== undefined) dbUpdates.value = updates.value;
      if (updates.age_min !== undefined) dbUpdates.age_min = updates.age_min;
      if (updates.age_max !== undefined) dbUpdates.age_max = updates.age_max;
      if (updates.is_published !== undefined) dbUpdates.is_published = updates.is_published;

      const { error } = await supabase
        .from('activities')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Activity updated successfully');
      await fetchActivities();
      return true;
    } catch (error: any) {
      console.error('Error updating activity:', error);
      toast.error(error.message || 'Failed to update activity');
      return false;
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      // Delete steps first
      await supabase.from('activity_steps').delete().eq('activity_id', id);
      const { error } = await supabase.from('activities').delete().eq('id', id);
      if (error) throw error;
      toast.success('Activity deleted');
      await fetchActivities();
      return true;
    } catch (error: any) {
      console.error('Error deleting activity:', error);
      toast.error(error.message || 'Failed to delete activity');
      return false;
    }
  };

  const togglePublish = async (id: string, currentlyPublished: boolean) => {
    return updateActivity(id, { is_published: !currentlyPublished });
  };

  // Step CRUD
  const createStep = async (activityId: string, step: { game_type: string; data: Record<string, any>; instruction_audio_url?: string; step_order: number }) => {
    try {
      const { data, error } = await supabase
        .from('activity_steps')
        .insert({
          activity_id: activityId,
          game_type: step.game_type,
          data: step.data,
          instruction_audio_url: step.instruction_audio_url || null,
          step_order: step.step_order,
        })
        .select()
        .single();
      if (error) throw error;
      await fetchActivities();
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create step');
      return null;
    }
  };

  const updateStep = async (stepId: string, updates: { game_type?: string; data?: Record<string, any>; instruction_audio_url?: string | null; step_order?: number }) => {
    try {
      const { error } = await supabase
        .from('activity_steps')
        .update(updates)
        .eq('id', stepId);
      if (error) throw error;
      await fetchActivities();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update step');
      return false;
    }
  };

  const deleteStep = async (stepId: string) => {
    try {
      const { error } = await supabase.from('activity_steps').delete().eq('id', stepId);
      if (error) throw error;
      await fetchActivities();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete step');
      return false;
    }
  };

  const uploadFile = async (file: File, bucket: string = 'game assets') => {
    if (!user) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Failed to upload file');
      return null;
    }
  };

  return {
    activities,
    loading,
    isAdmin,
    createActivity,
    updateActivity,
    deleteActivity,
    togglePublish,
    createStep,
    updateStep,
    deleteStep,
    uploadFile,
    refetch: fetchActivities,
  };
}
