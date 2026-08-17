CREATE TABLE public.books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text,
  description text,
  cover_url text,
  pdf_path text,
  age_min integer DEFAULT 3,
  age_max integer DEFAULT 8,
  language text NOT NULL DEFAULT 'English',
  page_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'processing',
  error_message text,
  published boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.books TO authenticated;
GRANT ALL ON public.books TO service_role;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin manage books" ON public.books FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "read published ready books" ON public.books FOR SELECT TO authenticated
  USING (published = true AND status = 'ready');

CREATE TABLE public.book_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  image_url text,
  extracted_text text,
  needs_ocr boolean NOT NULL DEFAULT false,
  audio_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (book_id, page_number)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_pages TO authenticated;
GRANT ALL ON public.book_pages TO service_role;
ALTER TABLE public.book_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin manage book pages" ON public.book_pages FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "read pages of published books" ON public.book_pages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.books b WHERE b.id = book_pages.book_id AND b.published = true AND b.status = 'ready'));

CREATE TABLE public.reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  current_page integer NOT NULL DEFAULT 1,
  pages_completed integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  stars_earned integer NOT NULL DEFAULT 0,
  last_read_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (child_id, book_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_progress TO authenticated;
GRANT ALL ON public.reading_progress TO service_role;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin read reading progress" ON public.reading_progress FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "parent manage own reading progress" ON public.reading_progress FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.child_profiles c WHERE c.id = reading_progress.child_id AND c.parent_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.child_profiles c WHERE c.id = reading_progress.child_id AND c.parent_id = auth.uid()));

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reading_progress_updated_at BEFORE UPDATE ON public.reading_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();