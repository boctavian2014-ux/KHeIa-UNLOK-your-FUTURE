/**
 * Builds a deterministic cache key.
 * @param parts Key parts.
 */
export const buildCacheKey = (...parts: string[]) => parts.join(':').toLowerCase();
