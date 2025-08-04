import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function downloadFile(fileId: string, filename: string, userId?: string) {
  try {
    if (!userId) {
      // For guest downloads or free content
      toast.info('Processing download...');
      // In a real app, this would still go through the edge function for logging
      return;
    }

    const { data, error } = await supabase.functions.invoke('download-file', {
      body: { fileId, userId }
    });

    if (error) throw error;

    if (data.success) {
      // Create a temporary download link
      const link = document.createElement('a');
      link.href = data.download_url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started!');
    } else {
      throw new Error(data.error || 'Download failed');
    }
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Download failed. Please try again.');
  }
}

export async function requestFileAccess(fileId: string, userId: string) {
  try {
    // Check if user has access to this file
    const { data, error } = await supabase.functions.invoke('download-file', {
      body: { fileId, userId, checkAccess: true }
    });

    if (error) throw error;
    return data.hasAccess;
  } catch (error) {
    console.error('Access check error:', error);
    return false;
  }
}