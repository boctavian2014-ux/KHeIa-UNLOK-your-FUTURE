import { supabase } from './supabase';
import { getSubscriptionStatus, getQuizQuestionLimit } from './subscription.service';

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
 * Fetches quiz questions for a chapter.
 * Free users: max 5 questions. Premium: 10.
 * Shuffles options per question. Works without userId (anonymous mode).
 */
export const fetchQuizWithOptions = async (
  chapterId: string,
  userId: string | null,
  requestedCount = 10
): Promise<QuizQuestion[]> => {
  const status = await getSubscriptionStatus(userId);
  const limit = getQuizQuestionLimit(status.isPremium);
  const count = Math.min(requestedCount, limit);

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

  let items = (data ?? []) as Array<Record<string, unknown>>;
  if (items.length === 0) {
    items = offlineItems
      .filter((i) => i.chapter_id === chapterId)
      .map((i) => ({ id: i.id, chapter_id: i.chapter_id, question: i.question, explanation: null }));
  }

  const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
  return shuffle(items).slice(0, count);
}

const offlineChapters = require('../../assets/offline-data/chapters.json') as Array<{ id: string; subject_id: string }>;
const offlineItems = require('../../assets/offline-data/chapterpracticeitems.json') as Array<{
  id: string;
  chapter_id: string;
  question: string;
}>;
const offlineOpts = require('../../assets/offline-data/chapterpracticeoptions.json') as Array<{
  id: string;
  practice_item_id: string;
  text: string;
  is_correct: boolean;
}>;

/**
 * Fetches quiz questions for an EN/BAC exam test (din toate capitolele unei materii).
 */
export const fetchExamTestQuestions = async (
  subjectId: string,
  count = 20
): Promise<QuizQuestion[]> => {
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id')
    .eq('subject_id', subjectId)
    .eq('published', true);

  let chapterIds = (chapters ?? []).map((c) => c.id);
  if (chapterIds.length === 0) {
    chapterIds = offlineChapters.filter((c) => c.subject_id === subjectId).map((c) => c.id);
  }
  if (chapterIds.length === 0) return [];

  const { data: items } = await supabase
    .from('chapterpracticeitems')
    .select('*')
    .in('chapter_id', chapterIds);

  let allItems = (items ?? []) as Array<Record<string, unknown>>;
  if (allItems.length === 0) {
    allItems = offlineItems
      .filter((i) => chapterIds.includes(i.chapter_id))
      .map((i) => ({ id: i.id, chapter_id: i.chapter_id, question: i.question, explanation: null }));
  }
  const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
  const selected = shuffle(allItems).slice(0, count);

  if (selected.length === 0) return [];

  const ids = selected.map((i) => i.id as string);
  const { data: optsData } = await supabase
    .from('chapterpracticeoptions')
    .select('*')
    .in('practice_item_id', ids);

  let opts = (optsData ?? []) as Array<{ id: string; practice_item_id: string; text: string; is_correct: boolean }>;
  if (opts.length === 0) {
    opts = offlineOpts.filter((o) => ids.includes(o.practice_item_id));
  }

  const optsByItem = opts.reduce<Record<string, Array<{ id: string; text: string; is_correct: boolean }>>>(
    (acc, o) => {
      const pid = o.practice_item_id as string;
      if (!acc[pid]) acc[pid] = [];
      acc[pid].push({ id: o.id, text: o.text, is_correct: o.is_correct ?? false });
      return acc;
    },
    {}
  );

  const shuffleOpts = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  return selected.map((item) => {
    const raw = optsByItem[item.id as string] ?? [];
    const options = shuffleOpts(raw).slice(0, 5).map((o) => ({
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

  const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
  const selected = shuffle(freshItems).slice(0, count);
  const repeatedIds: string[] = [];

  return { items: selected, repeatedIds };
};

const BONUS_CHAPTERS = require('../../assets/offline-data/chapters.json') as Array<{
  id: string;
  subject_id: string;
  title: string;
  order: number;
}>;

export type MonitorPerformanceResult = {
  needsEncouragement: boolean;
  averageScore: number;
  totalAttempts: number;
  message: string | null;
  unlockedResource: { type: 'coins'; amount: number } | null;
  suggestedChapter: { chapterId: string; title: string } | null;
  offerDiscount24h: boolean;
};

const SCORE_THRESHOLD = 5.0;
const CONCIERGE_BONUS_COINS = 10;

/**
 * Smart Concierge: Monitors user performance for a chapter.
 * If average score is below 5.0, returns encouragement and unlocks a bonus resource.
 */
export async function monitorPerformance(
  userId: string,
  chapterId: string
): Promise<MonitorPerformanceResult> {
  const { data: items } = await supabase
    .from('chapterpracticeitems')
    .select('id')
    .eq('chapter_id', chapterId);

  const practiceIds = (items ?? []).map((i) => i.id as string);
  if (practiceIds.length === 0) {
    return {
      needsEncouragement: false,
      averageScore: 0,
      totalAttempts: 0,
      message: null,
      unlockedResource: null,
      suggestedChapter: null,
      offerDiscount24h: false,
    };
  }

  const { data: answered } = await supabase
    .from('userquizitems')
    .select('practice_item_id, is_correct')
    .eq('user_id', userId)
    .in('practice_item_id', practiceIds);

  const relevant = (answered ?? []).filter((a) => practiceIds.includes(a.practice_item_id as string));
  const totalAttempts = relevant.length;
  const correctCount = relevant.filter((a) => a.is_correct).length;
  const averageScore = totalAttempts > 0 ? (correctCount / totalAttempts) * 10 : 0;

  if (averageScore >= SCORE_THRESHOLD || totalAttempts < 3) {
    return {
      needsEncouragement: false,
      averageScore,
      totalAttempts,
      message: null,
      unlockedResource: null,
      suggestedChapter: null,
      offerDiscount24h: false,
    };
  }

  const { awardCoins } = await import('./gamification.service');
  await awardCoins(userId, CONCIERGE_BONUS_COINS, 'chapter', `concierge-${chapterId}`);

  const chapter = BONUS_CHAPTERS.find((c) => c.id === chapterId);
  const chapterTitle = chapter?.title ?? 'acest capitol';

  const messages = [
    `Ești pe drumul cel bun! Am deblocat ${CONCIERGE_BONUS_COINS} monede bonus. Continuă exersarea la ${chapterTitle} – fiecare încercare te aduce mai aproape de succes.`,
    `Scorul tău mediu la ${chapterTitle} poate crește. Primești ${CONCIERGE_BONUS_COINS} monede bonus pentru perseverență. Revino la teorie și încearcă din nou!`,
  ];
  const message = messages[Math.floor(Math.random() * messages.length)];

  const subjectId = chapter?.subject_id;
  const nextChapter = subjectId
    ? BONUS_CHAPTERS.filter((c) => c.subject_id === subjectId && c.id !== chapterId)
        .sort((a, b) => a.order - b.order)[0]
    : null;

  const chapterHint = nextChapter
    ? ` Încearcă și capitolul „${nextChapter.title}” pentru exersare suplimentară.`
    : '';

  return {
    needsEncouragement: true,
    averageScore,
    totalAttempts,
    message: message + chapterHint,
    unlockedResource: { type: 'coins', amount: CONCIERGE_BONUS_COINS },
    suggestedChapter: nextChapter ? { chapterId: nextChapter.id, title: nextChapter.title } : null,
    offerDiscount24h: true,
  };
}

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
