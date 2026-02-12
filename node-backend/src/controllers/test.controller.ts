import { generateWithLLM } from '../services/ai.service';

type TestPayload = {
  exam_type: 'EN' | 'Bac';
  level: string;
  subjects?: string[];
};

export const generateTest = async (payload: TestPayload) => {
  const prompt = `Generează un test ${payload.exam_type} pentru nivel ${payload.level}.`;
  return generateWithLLM({ prompt, meta: payload });
};
