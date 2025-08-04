-- Create printables table for content management
CREATE TABLE public.printables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Beginner',
  pages INTEGER NOT NULL DEFAULT 1,
  downloads INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  preview_url TEXT,
  file_url TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  age_range TEXT,
  tags TEXT[],
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.printables ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Printables are viewable by everyone" 
ON public.printables 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Admins can manage printables" 
ON public.printables 
FOR ALL 
USING (is_admin());

-- Add trigger for timestamps
CREATE TRIGGER update_printables_updated_at
BEFORE UPDATE ON public.printables
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample printables data
INSERT INTO public.printables (title, description, category, difficulty, pages, downloads, rating, preview_url, file_url, featured, age_range, tags) VALUES
('Alphabet Tracing Worksheets', 'Complete A-Z letter tracing practice sheets', 'Worksheets', 'Beginner', 26, 1234, 4.8, '/placeholder.svg', '/files/alphabet-tracing.pdf', true, '3-6', ARRAY['alphabet', 'tracing', 'writing']),
('Rainbow Coloring Pages', 'Fun rainbow-themed coloring activities', 'Coloring Pages', 'Easy', 12, 892, 4.9, '/placeholder.svg', '/files/rainbow-coloring.pdf', false, '2-5', ARRAY['coloring', 'rainbow', 'creativity']),
('Math Addition Games', 'Interactive addition worksheets and games', 'Games', 'Intermediate', 8, 567, 4.7, '/placeholder.svg', '/files/math-addition.pdf', false, '4-7', ARRAY['math', 'addition', 'games']),
('Achievement Certificates', 'Colorful certificates for completed activities', 'Certificates', 'All Levels', 5, 445, 4.6, '/placeholder.svg', '/files/certificates.pdf', false, '3-8', ARRAY['certificates', 'achievements']),
('Phonics Workbook', 'Learn letter sounds and phonics patterns', 'Worksheets', 'Beginner', 20, 723, 4.7, '/placeholder.svg', '/files/phonics-workbook.pdf', true, '3-5', ARRAY['phonics', 'reading', 'sounds']),
('Shape Recognition Cards', 'Identify and match different shapes', 'Activity Sheets', 'Easy', 15, 398, 4.5, '/placeholder.svg', '/files/shape-cards.pdf', false, '2-4', ARRAY['shapes', 'recognition', 'matching']);