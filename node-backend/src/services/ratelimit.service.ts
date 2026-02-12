type RateLimitState = {
  count: number;
  resetAt: number;
};

const limits = new Map<string, RateLimitState>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

/**
 * Checks and increments rate limit counters.
 * @param key Identifier for the caller.
 * @returns True if allowed, false if rate-limited.
 */
export const allowRequest = (key: string) => {
  const now = Date.now();
  const state = limits.get(key);

  if (!state || state.resetAt < now) {
    limits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (state.count >= MAX_REQUESTS) {
    return false;
  }

  state.count += 1;
  return true;
};
