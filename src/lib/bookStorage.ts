import { supabase } from '@/integrations/supabase/client';

export const BOOKS_BUCKET = 'books';

const signedCache = new Map<string, { url: string; expires: number }>();

/**
 * Books live in a PRIVATE bucket. Never expose raw storage paths to children —
 * always resolve them through short-lived signed URLs.
 */
export async function getSignedBookUrl(
  path: string | null | undefined,
  expiresIn = 60 * 60,
): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith('http')) return path;

  const cached = signedCache.get(path);
  if (cached && cached.expires > Date.now() + 30_000) return cached.url;

  const { data, error } = await supabase.storage
    .from(BOOKS_BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error || !data?.signedUrl) {
    console.error('[bookStorage] signed url failed for', path, error);
    return null;
  }
  signedCache.set(path, { url: data.signedUrl, expires: Date.now() + expiresIn * 1000 });
  return data.signedUrl;
}

export async function getSignedBookUrls(paths: (string | null | undefined)[]) {
  const out: Record<string, string> = {};
  await Promise.all(
    paths.filter(Boolean).map(async (p) => {
      const url = await getSignedBookUrl(p!);
      if (url) out[p!] = url;
    }),
  );
  return out;
}

export const bookPdfPath = (bookId: string) => `${bookId}/book.pdf`;
export const bookCoverPath = (bookId: string, ext = 'png') => `${bookId}/cover.${ext}`;
export const bookPagePath = (bookId: string, page: number) => `${bookId}/pages/${page}.png`;

export async function uploadBookFile(path: string, file: Blob, contentType?: string) {
  const { error } = await supabase.storage.from(BOOKS_BUCKET).upload(path, file, {
    upsert: true,
    contentType: contentType || (file as File).type || undefined,
  });
  if (error) throw error;
  return path;
}

export async function removeBookFolder(bookId: string) {
  const roots = [`${bookId}`, `${bookId}/pages`];
  for (const root of roots) {
    const { data } = await supabase.storage.from(BOOKS_BUCKET).list(root, { limit: 1000 });
    const files = (data || []).filter((f) => f.id !== null).map((f) => `${root}/${f.name}`);
    if (files.length) await supabase.storage.from(BOOKS_BUCKET).remove(files);
  }
}
