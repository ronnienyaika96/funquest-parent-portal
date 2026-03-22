import { getGameAssetUrl } from './funquest-assets';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

/**
 * Maps lowercase letters a–z to their SVG paths in Supabase "game assets" bucket.
 * Path pattern: normal letters/letter {x}.svg
 * If a filename differs, update the value here.
 */
export const letterAssets: Record<string, string> = Object.fromEntries(
  LETTERS.map((l) => [l, `normal letters/letter ${l}.svg`])
);

/** Returns the public URL for a letter SVG, or empty string if not found. */
export function getLetterAsset(letter: string): string {
  const key = letter.toLowerCase();
  const path = letterAssets[key];
  return path ? getGameAssetUrl(path) : '';
}
