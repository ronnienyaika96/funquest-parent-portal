import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ActivityStep {
  id: string;
  title: string;
  instruction: string;
  mediaUrl?: string;
  audioUrl?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string | null;
  category: string;
  age_range: string;
  steps: ActivityStep[];
  thumbnail_url: string | null;
  images: string[];
  audio_urls: string[];
  status: 'draft' | 'published';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateActivityInput {
  name: string;
  description?: string;
  category: string;
  age_range: string;
  steps?: ActivityStep[];
  thumbnail_url?: string;
  images?: string[];
  audio_urls?: string[];
  status?: 'draft' | 'published';
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from('admin_roles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      setIsAdmin(!error && !!data);
    };

    checkAdmin();
  }, [user]);

  // Fetch activities
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((item: any) => ({
        ...item,
        steps: item.steps || [],
        images: item.images || [],
        audio_urls: item.audio_urls || [],
      }));

      setActivities(mapped);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch activities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchActivities();
    }
  }, [isAdmin]);

  // Create activity
  const createActivity = async (input: CreateActivityInput) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          name: input.name,
          description: input.description,
          category: input.category,
          age_range: input.age_range,
          steps: JSON.parse(JSON.stringify(input.steps || [])),
          images: JSON.parse(JSON.stringify(input.images || [])),
          audio_urls: JSON.parse(JSON.stringify(input.audio_urls || [])),
          thumbnail_url: input.thumbnail_url,
          status: input.status || 'draft',
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Activity created successfully',
      });

      await fetchActivities();
      return data;
    } catch (error: any) {
      console.error('Error creating activity:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create activity',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Update activity
  const updateActivity = async (id: string, updates: Partial<CreateActivityInput>) => {
    try {
      // Convert to JSON-safe format for Supabase
      const dbUpdates: Record<string, any> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.age_range !== undefined) dbUpdates.age_range = updates.age_range;
      if (updates.thumbnail_url !== undefined) dbUpdates.thumbnail_url = updates.thumbnail_url;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.steps !== undefined) dbUpdates.steps = JSON.parse(JSON.stringify(updates.steps));
      if (updates.images !== undefined) dbUpdates.images = JSON.parse(JSON.stringify(updates.images));
      if (updates.audio_urls !== undefined) dbUpdates.audio_urls = JSON.parse(JSON.stringify(updates.audio_urls));

      const { error } = await supabase
        .from('activities')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Activity updated successfully',
      });

      await fetchActivities();
      return true;
    } catch (error: any) {
      console.error('Error updating activity:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update activity',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Delete activity
  const deleteActivity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Activity deleted successfully',
      });

      await fetchActivities();
      return true;
    } catch (error: any) {
      console.error('Error deleting activity:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete activity',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Toggle publish status
  const togglePublish = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    return updateActivity(id, { status: newStatus });
  };

  // Upload file to storage
  const uploadFile = async (file: File, folder: string = 'activities') => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload Error',
        description: error.message || 'Failed to upload file',
        variant: 'destructive',
      });
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
    uploadFile,
    refetch: fetchActivities,
  };
}
