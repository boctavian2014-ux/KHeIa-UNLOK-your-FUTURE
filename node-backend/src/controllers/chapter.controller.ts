import { generateWithLLM } from '../services/ai.service';

type ChapterPayload = {
  topic: string;
  subject_id?: string;
  level?: 'gimnaziu' | 'liceu';
  chapter_id?: string;
  summaryOnly?: boolean;
};

export const generateChapter = async (payload: ChapterPayload) => {
  const topic = payload.topic?.trim();
  if (!topic) {
    return {
      source: 'error',
      prompt: '',
      meta: payload,
      content: 'Lipsește topic-ul capitolului.',
    };
  }

  const prompt = payload.summaryOnly
    ? `Generează un rezumat didactic pentru capitolul „${topic}”. Include explicații clare, exemple și puncte cheie, în limba română. Structura pe paragrafe scurte.`
    : `Generează conținut educațional pentru capitolul „${topic}” (nivel: ${payload.level ?? 'liceu'}). Include secțiuni logice, exemple și explicații în limba română.`;

  return generateWithLLM({ prompt, meta: payload });
};
