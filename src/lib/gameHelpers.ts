import { getLetterAsset } from './letterAssets';
import { getNumberAsset } from './numberAssets';

/**
 * Derives a human-readable instruction string from step data.
 * Handles objects, arrays, and raw strings gracefully.
 */
export function getInstructionText(data: Record<string, any>): string {
  const raw = data.question || data.instruction;
  if (!raw) return 'Tap the correct answer!';
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'object' && raw !== null && 'target' in raw) {
    const target = String(raw.target ?? '');
    const type = String(raw.type ?? '').toLowerCase();
    if (type === 'letter') return `Tap the letter ${target.toUpperCase()}`;
    if (type === 'number') return `Tap the number ${target}`;
    return `Tap ${target}`;
  }
  return 'Tap the correct answer!';
}

/**
 * Tries to resolve a label to an SVG asset URL (letter or number).
 * Returns the URL if found, otherwise null (caller should render text).
 */
export function resolveOptionAsset(label: string): string | null {
  const trimmed = label.trim();

  // Single letter
  if (/^[a-zA-Z]$/.test(trimmed)) {
    const url = getLetterAsset(trimmed);
    return url || null;
  }

  // Number 1-10
  const num = parseInt(trimmed, 10);
  if (!isNaN(num) && num >= 1 && num <= 10) {
    const url = getNumberAsset(num);
    return url || null;
  }

  return null;
}
