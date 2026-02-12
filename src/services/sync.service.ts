import type { Database } from '@nozbe/watermelondb';

/**
 * Synchronizes local WatermelonDB with Supabase backend.
 * @param database WatermelonDB instance.
 * @param lastPulledAt Timestamp of last sync.
 */
export const syncDatabase = async (database: Database, lastPulledAt?: number) => {
  return { database, lastPulledAt, changes: { created: [], updated: [], deleted: [] } };
};
