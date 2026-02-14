import { supabase } from './supabase';

const BACKEND_URL = (process.env.EXPO_PUBLIC_NODE_BACKEND_URL ?? '').trim();

async function fetchBackend<T>(path: string, body: object): Promise<{ data: T | null; error: Error | null }> {
  const url = BACKEND_URL.startsWith('http') ? BACKEND_URL : BACKEND_URL ? `https://${BACKEND_URL}` : '';
  if (!url) return { data: null, error: new Error('Backend nu este configurat.') };

  try {
    const res = await fetch(`${url}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    let data: T;
    try {
      data = (await res.json()) as T;
    } catch {
      data = { source: 'error', content: `Răspuns invalid: ${res.status}` } as T;
    }
    if (!res.ok) {
      const msg = (data as { content?: string })?.content ?? `Eroare ${res.status}`;
      return { data: { ...(data as object), source: 'error', content: msg } as T, error: null };
    }
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e : new Error(String(e)) };
  }
}

/**
 * Creates a new chapter with AI generation.
 * Folosește Edge Function; dacă eșuează, încercă backend-ul direct.
 */
export const createChapter = async (topic: string, subjectId: string, level: 'gimnaziu' | 'liceu') => {
  const { data, error } = await supabase.functions.invoke('generate-chapter-content', {
    body: { topic, subject_id: subjectId, level },
  });

  if (error && BACKEND_URL) {
    const fallback = await fetchBackend<{ source?: string; content?: string }>('/api/generate/chapter', {
      topic,
      subject_id: subjectId,
      level,
    });
    if (fallback.data) return { data: fallback.data, error: null };
  }
  if (error) return { data: null, error };
  return { data, error: null };
};

/**
 * Generates chapter theory summary.
 * Folosește Edge Function; dacă eșuează, încercă backend-ul direct.
 */
export const generateTheory = async (chapterId: string, topic?: string) => {
  const body = { chapter_id: chapterId, ...(topic && { topic }), summaryOnly: true };
  const { data, error } = await supabase.functions.invoke('generate-chapter-summary', {
    body: { chapter_id: chapterId, ...(topic && { topic }) },
  });

  if (error && BACKEND_URL) {
    const fallback = await fetchBackend<{ source?: string; content?: string }>('/api/generate/summary', body);
    if (fallback.data) return { data: fallback.data, error: null };
  }
  if (error) return { data: null, error };
  return { data, error: null };
};

/**
 * Generates a quiz for a chapter.
 * @param chapterId Chapter id.
 */
export const generateQuiz = async (chapterId: string) => {
  return supabase.functions.invoke('generate-chapter-content', {
    body: { chapter_id: chapterId, mode: 'quiz' },
  });
};
