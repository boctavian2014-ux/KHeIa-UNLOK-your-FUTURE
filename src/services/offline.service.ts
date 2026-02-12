/**
 * Returns a fallback JSON data source name.
 * @param table Table name.
 */
export const getOfflineFallback = (table: string) => `assets/offline-data/${table}.json`;
