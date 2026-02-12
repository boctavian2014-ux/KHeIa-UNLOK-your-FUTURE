import { supabase } from './supabase';

export type QuizOption = {
  id: string;
  text: string;
  is_correct: boolean;
};

export type QuizQuestion = {
  id: string;
  question: string;
  explanation: string | null;
  options: QuizOption[];
};

type QuizSelection = {
  items: Array<Record<string, unknown>>;
  repeatedIds: string[];
};

/**
 * Fetches 10 quiz questions with 5 options each for a chapter.
 * Shuffles options per question. Works without userId (anonymous mode).
 */
export const fetchQuizWithOptions = async (
  chapterId: string,
  userId: string | null,
  count = 10
): Promise<QuizQuestion[]> => {
  const { items } = userId
    ? await selectQuizQuestions(chapterId, userId, count)
    : { items: await fetchChapterItems(chapterId, count) };

  if (items.length === 0) return [];

  const ids = items.map((i) => i.id as string);
  const { data: opts } = await supabase
    .from('chapterpracticeoptions')
    .select('*')
    .in('practice_item_id', ids);

  const optsByItem = (opts ?? []).reduce<Record<string, Array<{ id: string; text: string; is_correct: boolean }>>>(
    (acc, o) => {
      const pid = o.practice_item_id as string;
      if (!acc[pid]) acc[pid] = [];
      acc[pid].push({ id: o.id, text: o.text, is_correct: o.is_correct ?? false });
      return acc;
    },
    {}
  );

  const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  return items.map((item) => {
    const raw = optsByItem[item.id as string] ?? [];
    const options = shuffle(raw).slice(0, 5).map((o) => ({
      id: o.id,
      text: o.text,
      is_correct: o.is_correct,
    }));
    return {
      id: item.id as string,
      question: item.question as string,
      explanation: (item.explanation as string) ?? null,
      options,
    };
  });
};

async function fetchChapterItems(chapterId: string, count: number) {
  const { data } = await supabase
    .from('chapterpracticeitems')
    .select('*')
    .eq('chapter_id', chapterId)
    .limit(count * 2);
  const items = (data ?? []) as Array<Record<string, unknown>>;
  return items.slice(0, count);
}

/**
 * Selects non-repeating quiz questions with fallback repeats.
 * @param chapterId Chapter id.
 * @param userId User id.
 * @param count Number of questions.
 * @returns Selected items and repeated ids.
 */
export const selectQuizQuestions = async (
  chapterId: string,
  userId: string,
  count: number,
): Promise<QuizSelection> => {
  const { data: items } = await supabase
    .from('chapterpracticeitems')
    .select('*')
    .eq('chapter_id', chapterId);

  const { data: answered } = await supabase
    .from('userquizitems')
    .select('practice_item_id')
    .eq('user_id', userId);

  const answeredIds = new Set((answered ?? []).map((row) => row.practice_item_id as string));
  const allItems = items ?? [];
  const freshItems = allItems.filter((item) => !answeredIds.has(item.id as string));

  const selected = freshItems.slice(0, count);
  const repeatedIds: string[] = [];

  if (selected.length < count) {
    const needed = count - selected.length;
    const repeatPool = allItems.filter((item) => !selected.includes(item));
    const repeats = repeatPool.slice(0, needed);
    repeatedIds.push(...repeats.map((item) => String(item.id)));
    selected.push(...repeats);
  }

  return { items: selected, repeatedIds };
};

/**
 * Marks questions as answered for a user.
 * @param userId User id.
 * @param results Array of { practice_item_id, is_correct }.
 */
export const markQuestionsAnswered = async (
  userId: string,
  results: Array<{ practice_item_id: string; is_correct: boolean }>
) => {
  if (results.length === 0) return { data: [], error: null };

  const payload = results.map(({ practice_item_id, is_correct }) => ({
    user_id: userId,
    practice_item_id,
    is_correct,
    answered_at: new Date().toISOString(),
  }));

  return supabase.from('userquizitems').insert(payload);
};
