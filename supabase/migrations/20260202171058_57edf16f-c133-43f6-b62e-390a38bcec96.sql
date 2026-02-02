-- Create activities table for content management
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  age_range TEXT NOT NULL,
  steps JSONB DEFAULT '[]'::jsonb,
  thumbnail_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  audio_urls JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Admin-only management policy
CREATE POLICY "Admins can manage activities"
ON public.activities
FOR ALL
USING (is_admin());

-- Users can view published activities
CREATE POLICY "Users can view published activities"
ON public.activities
FOR SELECT
USING (status = 'published');

-- Trigger for updated_at
CREATE TRIGGER update_activities_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage policies for admin uploads if not exist
CREATE POLICY "Admins can upload to assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'assets' AND is_admin());

CREATE POLICY "Admins can update assets"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'assets' AND is_admin());

CREATE POLICY "Admins can delete assets"
ON storage.objects
FOR DELETE
USING (bucket_id = 'assets' AND is_admin());