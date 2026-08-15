/**
 * Client-side upload size limits per Supabase Storage bucket.
 *
 * NOTE: these are a first line of defence only. Matching hard limits should also
 * be set on each bucket in the Supabase dashboard (Storage > bucket > Settings >
 * "Restrict file upload size"), since bucket settings cannot be changed via SQL.
 */
const MB = 1024 * 1024;

export const BUCKET_SIZE_LIMITS: Record<string, number> = {
  avatars: 5 * MB,
  badges: 5 * MB,
  thumbnails: 10 * MB,
  'child uploads': 10 * MB,
  'game assets': 15 * MB,
  Animations: 15 * MB,
  audio: 20 * MB,
  'admin assets': 25 * MB,
  reports: 25 * MB,
};

export const DEFAULT_UPLOAD_LIMIT = 15 * MB;

export function getBucketLimit(bucket: string): number {
  return BUCKET_SIZE_LIMITS[bucket] ?? DEFAULT_UPLOAD_LIMIT;
}

export function formatBytes(bytes: number): string {
  if (bytes >= MB) return `${Math.round(bytes / MB)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

/**
 * Returns an error message when the file is too large for the bucket, otherwise null.
 */
export function validateUploadSize(file: File, bucket: string): string | null {
  const limit = getBucketLimit(bucket);
  if (file.size > limit) {
    return `"${file.name}" is ${formatBytes(file.size)}. The maximum size for "${bucket}" is ${formatBytes(limit)}.`;
  }
  return null;
}
