import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { bookCoverPath, bookPdfPath, removeBookFolder, uploadBookFile } from '@/lib/bookStorage';
import { processPdf } from '@/lib/pdfProcessing';

export interface Book {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  cover_url: string | null;
  pdf_path: string | null;
  age_min: number | null;
  age_max: number | null;
  language: string;
  page_count: number;
  status: 'processing' | 'ready' | 'error' | string;
  error_message: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookPage {
  id: string;
  book_id: string;
  page_number: number;
  image_url: string | null;
  extracted_text: string | null;
  needs_ocr: boolean;
  audio_url: string | null;
}

export interface BookMeta {
  title: string;
  author: string;
  description: string;
  age_min: number;
  age_max: number;
  language: string;
}

export type ProcessProgress = { stage: string; current: number; total: number } | null;

/** Admin-facing book management (all books, regardless of status). */
export function useAdminBooks() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProcessProgress>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else {
      setError(null);
      setBooks((data || []) as Book[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) fetchBooks();
    else {
      setBooks([]);
      setLoading(false);
    }
  }, [user, fetchBooks]);

  /** Full pipeline: create row -> upload pdf -> render/extract pages -> mark ready. */
  const createBook = useCallback(
    async (meta: BookMeta, pdfFile: File, coverFile: File | null, useOcr = true) => {
      const { data: created, error: insertErr } = await supabase
        .from('books')
        .insert([{ ...meta, status: 'processing', published: false, created_by: user?.id ?? null }])
        .select()
        .single();
      if (insertErr || !created) throw insertErr || new Error('Could not create the book record.');

      const bookId = created.id as string;
      try {
        const pdfPath = bookPdfPath(bookId);
        setProgress({ stage: 'Uploading PDF', current: 0, total: 1 });
        await uploadBookFile(pdfPath, pdfFile, 'application/pdf');

        const result = await processPdf(pdfFile, bookId, setProgress, { ocr: useOcr });

        let coverPath: string | null = null;
        if (coverFile) {
          const ext = coverFile.name.split('.').pop()?.toLowerCase() || 'png';
          coverPath = await uploadBookFile(bookCoverPath(bookId, ext), coverFile);
        } else if (result.coverBlob) {
          coverPath = await uploadBookFile(bookCoverPath(bookId), result.coverBlob, 'image/png');
        }

        if (result.pages.length) {
          const rows = result.pages.map((p) => ({
            book_id: bookId,
            page_number: p.page_number,
            image_url: p.image_path,
            extracted_text: p.extracted_text,
            needs_ocr: p.needs_ocr,
          }));
          const { error: pagesErr } = await supabase.from('book_pages').insert(rows);
          if (pagesErr) throw pagesErr;
        }

        const { error: updErr } = await supabase
          .from('books')
          .update({
            pdf_path: pdfPath,
            cover_url: coverPath,
            page_count: result.pageCount,
            status: 'ready',
            error_message: null,
          })
          .eq('id', bookId);
        if (updErr) throw updErr;
      } catch (err: any) {
        console.error('[useAdminBooks] processing failed', err);
        await supabase
          .from('books')
          .update({ status: 'error', error_message: err?.message || 'Processing failed.' })
          .eq('id', bookId);
        setProgress(null);
        await fetchBooks();
        throw err;
      }
      setProgress(null);
      await fetchBooks();
      return bookId;
    },
    [user, fetchBooks],
  );

  /** Re-run processing for a book that failed, using a freshly supplied PDF. */
  const retryProcessing = useCallback(
    async (book: Book, pdfFile: File, useOcr = true) => {
      await supabase.from('books').update({ status: 'processing', error_message: null }).eq('id', book.id);
      await supabase.from('book_pages').delete().eq('book_id', book.id);
      await fetchBooks();
      try {
        const pdfPath = bookPdfPath(book.id);
        await uploadBookFile(pdfPath, pdfFile, 'application/pdf');
        const result = await processPdf(pdfFile, book.id, setProgress, { ocr: useOcr });
        let coverPath = book.cover_url;
        if (!coverPath && result.coverBlob) {
          coverPath = await uploadBookFile(bookCoverPath(book.id), result.coverBlob, 'image/png');
        }
        if (result.pages.length) {
          const { error: pagesErr } = await supabase.from('book_pages').insert(
            result.pages.map((p) => ({
              book_id: book.id,
              page_number: p.page_number,
              image_url: p.image_path,
              extracted_text: p.extracted_text,
              needs_ocr: p.needs_ocr,
            })),
          );
          if (pagesErr) throw pagesErr;
        }
        await supabase
          .from('books')
          .update({
            pdf_path: pdfPath,
            cover_url: coverPath,
            page_count: result.pageCount,
            status: 'ready',
            error_message: null,
          })
          .eq('id', book.id);
      } catch (err: any) {
        await supabase
          .from('books')
          .update({ status: 'error', error_message: err?.message || 'Processing failed.' })
          .eq('id', book.id);
        setProgress(null);
        await fetchBooks();
        throw err;
      }
      setProgress(null);
      await fetchBooks();
    },
    [fetchBooks],
  );

  const updateBook = useCallback(
    async (id: string, patch: Partial<Book>) => {
      const { error } = await supabase.from('books').update(patch).eq('id', id);
      if (error) throw error;
      await fetchBooks();
    },
    [fetchBooks],
  );

  const togglePublish = useCallback(
    async (book: Book) => {
      if (!book.published && book.status !== 'ready') {
        throw new Error('Only books with status "Ready" can be published.');
      }
      await updateBook(book.id, { published: !book.published });
    },
    [updateBook],
  );

  const deleteBook = useCallback(
    async (id: string) => {
      try {
        await removeBookFolder(id);
      } catch (err) {
        console.warn('[useAdminBooks] could not clean storage', err);
      }
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (error) throw error;
      await fetchBooks();
    },
    [fetchBooks],
  );

  return {
    books,
    loading,
    error,
    progress,
    fetchBooks,
    createBook,
    retryProcessing,
    updateBook,
    togglePublish,
    deleteBook,
  };
}

/** Child-facing library: only published + ready books are visible (enforced by RLS too). */
export function usePublishedBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('published', true)
      .eq('status', 'ready')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else {
      setError(null);
      setBooks((data || []) as Book[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { books, loading, error, reload: load };
}
