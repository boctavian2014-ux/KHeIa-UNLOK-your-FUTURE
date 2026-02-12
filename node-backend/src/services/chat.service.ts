import { getEnv } from '../config/env';

const EN_BAC_SYSTEM_PROMPT = `Ești KhEla, un asistent educațional dedicat pregătirii pentru Evaluarea Națională și Bacalaureat din România.
Răspunde la întrebări despre materii școlare (Română, Matematică, Istorie, Fizică, Chimie, Biologie, Geografie, etc.), explică concepte, oferă sfaturi de examinare și ajută elevii să se pregătească.
Răspunde în română, concis și clar.`;

type ChatMessage = { role: string; content: string };

export async function chatENBAC(messages: ChatMessage[]): Promise<{ content: string }> {
  const { openAiKey } = getEnv();
  if (!openAiKey) {
    return { content: 'Serviciul de chat nu este configurat. Adaugă OPENAI_API_KEY în backend.' };
  }

  const apiMessages = [
    { role: 'system' as const, content: EN_BAC_SYSTEM_PROMPT },
    ...messages
      .filter((m) => m.role && m.content)
      .map((m) => ({
        role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.content,
      })),
  ];

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openAiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: apiMessages,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { content: `Eroare: ${err || res.statusText}` };
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content ?? '';
  return { content };
}
