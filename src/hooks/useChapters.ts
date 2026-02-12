import { useEffect, useState } from 'react';
import { getChapters } from '@/services/chapters.service';

export const useChapters = (subjectId: string) => {
  const [chapters, setChapters] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    getChapters(subjectId).then(({ data }) => setChapters(data ?? []));
  }, [subjectId]);

  return { chapters };
};
