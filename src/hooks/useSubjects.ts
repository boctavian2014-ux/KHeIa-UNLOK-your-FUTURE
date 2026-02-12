import { useEffect, useState } from 'react';
import { getSubjects } from '@/services/subjects.service';

export const useSubjects = (level: 'gimnaziu' | 'liceu') => {
  const [subjects, setSubjects] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    getSubjects(level).then(({ data }) => setSubjects(data ?? []));
  }, [level]);

  return { subjects };
};
