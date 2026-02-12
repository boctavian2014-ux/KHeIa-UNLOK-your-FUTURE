import { generateWithLLM } from '../services/ai.service';

type QuizPayload = {
  chapter_id: string;
  topic?: string;
};

export const generateQuiz = async (payload: QuizPayload) => {
  const prompt = `Generează un quiz cu 10 întrebări pentru ${payload.topic ?? payload.chapter_id}.`;
  return generateWithLLM({ prompt, meta: payload });
};
