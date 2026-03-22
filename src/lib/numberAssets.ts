import { getGameAssetUrl } from './funquest-assets';

/**
 * Maps numbers 1–10 to their SVG paths in Supabase "game assets" bucket.
 * Path pattern: normal numbers/number-{n}.svg
 * If a filename differs, update the value here.
 */
export const numberAssets: Record<number, string> = Object.fromEntries(
  Array.from({ length: 10 }, (_, i) => [i + 1, `normal numbers/number-${i + 1}.svg`])
);

/** Returns the public URL for a number SVG, or empty string if not found. */
export function getNumberAsset(num: number): string {
  const path = numberAssets[num];
  return path ? getGameAssetUrl(path) : '';
}
