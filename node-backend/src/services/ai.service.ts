import OpenAI from 'openai';
import { getEnv } from '../config/env';

type LLMRequest = {
  prompt: string;
  meta?: Record<string, unknown>;
};

/**
 * Generates content using OpenAI.
 * @param request LLM request payload.
 * @returns Structured response with generated content.
 */
export const generateWithLLM = async (request: LLMRequest) => {
  const { openAiKey } = getEnv();
  if (!openAiKey) {
    return {
      source: 'error',
      prompt: request.prompt,
      meta: request.meta ?? {},
      content: 'Eroare: OPENAI_API_KEY lipsește în configurare.',
    };
  }

  const openai = new OpenAI({ apiKey: openAiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Ești un asistent educațional pentru elevii din România. Generează conținut clar, structurat și în limba română. Răspunde exclusiv cu conținutul solicitat, fără introduceri sau concluzii meta.',
        },
        { role: 'user', content: request.prompt },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content?.trim() ?? '';

    return {
      source: 'openai',
      prompt: request.prompt,
      meta: request.meta ?? {},
      content: content || 'Nu s-a putut genera conținut.',
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare necunoscută';
    return {
      source: 'error',
      prompt: request.prompt,
      meta: request.meta ?? {},
      content: `Eroare la generare: ${message}`,
    };
  }
};
