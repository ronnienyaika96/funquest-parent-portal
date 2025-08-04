-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL,
  badge TEXT,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products (read-only for all users)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (status = 'active');

-- Create policies for admin management (for future admin functionality)
CREATE POLICY "Admins can manage products" 
ON public.products 
FOR ALL 
USING (is_admin());

-- Insert sample products
INSERT INTO public.products (title, short_description, long_description, price, original_price, category, badge, image_url) VALUES
('ABC Learning Activity Book', 'Interactive alphabet learning with fun activities', 'A comprehensive activity book designed to help children learn the alphabet through engaging exercises, coloring pages, and tracing activities. Perfect for ages 3-6.', 19.99, 24.99, 'Books', 'Best Seller', '/placeholder.svg'),
('Digital Letter Tracing Game', 'Interactive digital game for letter practice', 'An engaging digital game that helps children practice letter formation through guided tracing exercises with immediate feedback and rewards.', 9.99, NULL, 'Games', 'New', '/placeholder.svg'),
('Bible Stories Coloring Pack', 'Beautiful coloring pages featuring Bible stories', 'A collection of 50+ coloring pages featuring popular Bible stories and characters. High-quality illustrations that inspire creativity while teaching valuable lessons.', 14.99, NULL, 'Printables', NULL, '/placeholder.svg'),
('Complete Learning Bundle', 'Everything you need for early childhood education', 'Our most comprehensive package including activity books, digital games, printables, and exclusive content. Perfect for homeschooling families.', 49.99, 69.99, 'Bundles', 'Best Value', '/placeholder.svg'),
('Phonics Flashcards Set', 'Physical flashcards for phonics learning', 'Premium quality flashcards featuring phonics patterns, sight words, and pronunciation guides. Includes 100 cards with accompanying audio content.', 22.99, NULL, 'Books', NULL, '/placeholder.svg'),
('Math Adventures Game', 'Fun digital math learning game', 'Make math fun with our interactive adventure game featuring counting, addition, subtraction, and problem-solving challenges for ages 4-8.', 12.99, NULL, 'Games', NULL, '/placeholder.svg'),
('Handwriting Practice Sheets', 'Printable handwriting practice worksheets', 'Comprehensive set of handwriting practice sheets covering uppercase, lowercase, numbers, and words. Includes dotted lines and guided practice.', 7.99, NULL, 'Printables', NULL, '/placeholder.svg'),
('Story Time Collection', 'Digital storybooks with interactive features', 'A collection of 20 interactive digital storybooks with read-along audio, animations, and comprehension activities to enhance reading skills.', 16.99, NULL, 'Games', 'New', '/placeholder.svg');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();