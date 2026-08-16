/**
 * Parental gate session flag. Once an adult solves the math puzzle, adult areas
 * stay unlocked for the rest of the browser session (cleared when the tab closes).
 */
const KEY = 'funquest.parentalGate.passed';

export function isParentalGatePassed(): boolean {
  try {
    return sessionStorage.getItem(KEY) === 'true';
  } catch {
    return false;
  }
}

export function setParentalGatePassed(passed: boolean) {
  try {
    if (passed) sessionStorage.setItem(KEY, 'true');
    else sessionStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}
