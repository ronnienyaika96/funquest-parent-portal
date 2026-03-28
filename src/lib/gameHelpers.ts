import { getLetterAsset } from './letterAssets';
import { getNumberAsset } from './numberAssets';

/**
 * Extracts a displayable string from a target/choice object or plain string.
 * Handles: { char: "a" }, { value: 7 }, { label: "Cat" }, or plain "a".
 */
export function extractLabel(opt: any): string {
  if (opt == null) return '';
  if (typeof opt === 'string') return opt;
  if (typeof opt === 'number') return String(opt);
  if (typeof opt === 'object') {
    if (typeof opt.char === 'string') return opt.char;
    if (typeof opt.label === 'string') return opt.label;
    if (opt.value != null) return String(opt.value);
    if (typeof opt.text === 'string') return opt.text;
  }
  return String(opt);
}

/**
 * Derives a human-readable instruction string from step data.
 * Priority: data.ui.instruction > structured target > fallback.
 */
export function getInstructionText(data: Record<string, any>): string {
  // 1. Pre-built instruction from the DB
  if (data.ui?.instruction && typeof data.ui.instruction === 'string') {
    return data.ui.instruction;
  }

  // 2. Try to find a target from various locations
  const targetSources = [
    data.question?.target,
    data.instruction?.target,
    data.target,
    data.prompt?.target,
  ];

  for (const raw of targetSources) {
    if (raw == null) continue;
    const display = extractLabel(raw);
    if (!display) continue;

    // Infer type
    const type = (typeof raw === 'object' && raw.type) ? String(raw.type).toLowerCase() : '';
    if (type === 'letter' || /^[a-zA-Z]$/.test(display)) {
      return `Tap the letter ${display.toLowerCase()}`;
    }
    if (type === 'number' || /^\d+$/.test(display)) {
      return `Tap the number ${display}`;
    }
    return `Tap ${display}`;
  }

  // 3. Plain string question/instruction
  const plain = data.question || data.instruction;
  if (typeof plain === 'string') return plain;

  return 'Tap the correct answer!';
}

/**
 * Checks if two choice objects are equivalent (for determining correctness).
 */
export function choicesMatch(a: any, b: any): boolean {
  if (a == null || b == null) return false;
  const la = extractLabel(a);
  const lb = extractLabel(b);
  if (la && lb) return la.toLowerCase() === lb.toLowerCase();
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Tries to resolve a label (string or object) to an SVG asset URL.
 * Returns the URL if found, otherwise null.
 */
export function resolveOptionAsset(label: any): string | null {
  const trimmed = extractLabel(label).trim();
  if (!trimmed) return null;

  // Single letter
  if (/^[a-zA-Z]$/.test(trimmed)) {
    return getLetterAsset(trimmed) || null;
  }

  // Number 1-10
  const num = parseInt(trimmed, 10);
  if (!isNaN(num) && num >= 1 && num <= 10) {
    return getNumberAsset(num) || null;
  }

  return null;
}
