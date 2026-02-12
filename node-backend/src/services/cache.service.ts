/**
 * Simple in-memory cache placeholder.
 */
const cache = new Map<string, unknown>();

/**
 * Reads cached value by key.
 * @param key Cache key.
 * @returns Cached value or undefined.
 */
export const getCache = (key: string) => cache.get(key);

/**
 * Writes cached value by key.
 * @param key Cache key.
 * @param value Value to store.
 */
export const setCache = (key: string, value: unknown) => {
  cache.set(key, value);
};
