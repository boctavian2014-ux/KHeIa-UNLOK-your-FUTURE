import { useState } from 'react';
import { syncDatabase } from '@/services/sync.service';
import { database } from '@/database';

export const useSync = () => {
  const [lastSyncedAt, setLastSyncedAt] = useState<number | undefined>(undefined);

  const runSync = async () => {
    await syncDatabase(database, lastSyncedAt);
    setLastSyncedAt(Date.now());
  };

  return { lastSyncedAt, runSync };
};
