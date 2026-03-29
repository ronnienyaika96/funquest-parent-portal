import { getGameAssetUrl } from './funquest-assets';

/**
 * Maps numbers 1–10 to their SVG paths in Supabase "game assets" bucket.
 * Real path: Numbers/number-1.svg
 */
export const numberAssets: Record<number, string> = Object.fromEntries(
  Array.from({ length: 10 }, (_, i) => [i + 1, `Numbers/number-${i + 1}.svg`])
);

/** Returns the public URL for a number SVG, or empty string if not found. */
export function getNumberAsset(num: number): string {
  const path = numberAssets[num];
  return path ? getGameAssetUrl(path) : '';
}
