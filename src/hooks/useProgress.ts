import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import { getUserChapterProgress, type UserChapterProgressRow } from '@/services/progress.service';
import { useCatalogContext } from '@/components/common/CatalogProvider';
import type { Subject, Chapter } from '@/services/catalog.service';

export type ProgressStats = {
  totalChapters: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  completionRate: number;
};

export type ChapterWithProgress = Chapter & {
  subjectName: string;
  status: string;
  lastQuizScore: number | null;
  updatedAt: string | null;
};

export type SubjectProgress = {
  subject: Subject;
  completed: number;
  total: number;
  rate: number;
  chapters: ChapterWithProgress[];
};

export type UseProgressState = {
  progressRecords: UserChapterProgressRow[];
  loading: boolean;
  stats: ProgressStats;
  toLearn: ChapterWithProgress[];
  recommendedNext: ChapterWithProgress[];
  subjectProgress: SubjectProgress[];
  recentChapters: ChapterWithProgress[];
  userId: string | null;
  refresh: () => Promise<void>;
};

const progressMap = (rows: UserChapterProgressRow[]): Map<string, UserChapterProgressRow> => {
  const m = new Map<string, UserChapterProgressRow>();
  for (const r of rows) m.set(r.chapter_id, r);
  return m;
};

export function useProgress(): UseProgressState {
  const { subjects, chapters } = useCatalogContext();
  const [userId, setUserId] = useState<string | null>(null);
  const [progressRecords, setProgressRecords] = useState<UserChapterProgressRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);

    if (!user?.id) {
      setProgressRecords([]);
      setLoading(false);
      return;
    }

    const rows = await getUserChapterProgress(user.id);
    setProgressRecords(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetch();
    });
    return () => subscription.unsubscribe();
  }, [fetch]);

  const progressByChapter = progressMap(progressRecords);
  const subjectMap = new Map(subjects.map((s) => [s.id, s]));

  const chaptersWithProgress: ChapterWithProgress[] = chapters.map((ch) => {
    const p = progressByChapter.get(ch.id);
    const subject = subjectMap.get(ch.subject_id);
    return {
      ...ch,
      subjectName: subject?.name ?? ch.subject_id,
      status: p?.status ?? 'not_started',
      lastQuizScore: p?.last_quiz_score ?? null,
      updatedAt: p?.updated_at ?? null,
    };
  });

  const completed = chaptersWithProgress.filter((c) => c.status === 'completed').length;
  const inProgress = chaptersWithProgress.filter((c) => c.status === 'in_progress').length;
  const notStarted = chaptersWithProgress.filter((c) => c.status === 'not_started').length;
  const total = chapters.length;
  const completionRate = total > 0 ? completed / total : 0;

  const stats: ProgressStats = {
    totalChapters: total,
    completed,
    inProgress,
    notStarted,
    completionRate,
  };

  const toLearn = chaptersWithProgress
    .filter((c) => c.status !== 'completed')
    .sort((a, b) => {
      const subA = a.subject_id;
      const subB = b.subject_id;
      if (subA !== subB) return subA.localeCompare(subB);
      return a.order - b.order;
    });

  const recommendedNext = toLearn.slice(0, 5);

  const subjectProgress: SubjectProgress[] = subjects.map((subject) => {
    const subjectChapters = chaptersWithProgress.filter((c) => c.subject_id === subject.id);
    const subCompleted = subjectChapters.filter((c) => c.status === 'completed').length;
    const subTotal = subjectChapters.length;
    return {
      subject,
      completed: subCompleted,
      total: subTotal,
      rate: subTotal > 0 ? subCompleted / subTotal : 0,
      chapters: subjectChapters,
    };
  }).filter((sp) => sp.total > 0);

  const recentChapters = chaptersWithProgress
    .filter((c) => c.updatedAt)
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
    .slice(0, 5);

  return {
    progressRecords,
    loading,
    stats,
    toLearn,
    recommendedNext,
    subjectProgress,
    recentChapters,
    userId,
    refresh: fetch,
  };
}
