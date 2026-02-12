import { useState } from 'react';
import { generateTest } from '@/services/test.service';

export const useTest = () => {
  const [test, setTest] = useState<Record<string, unknown> | null>(null);

  const startTest = async (payload: {
    user_id: string;
    exam_type: 'EN' | 'Bac';
    level: string;
    subjects?: string[];
  }) => {
    const { data } = await generateTest(payload);
    setTest(data ?? null);
  };

  return { test, startTest };
};
