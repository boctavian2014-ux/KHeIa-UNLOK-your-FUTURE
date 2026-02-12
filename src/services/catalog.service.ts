import { supabase } from './supabase';

const offlineSubjects = require('../../assets/offline-data/subjects.json') as Array<{
  id: string;
  name: string;
  level: string;
  exam_tags: string[];
}>;
const offlineChapters = require('../../assets/offline-data/chapters.json') as Array<{
  id: string;
  subject_id: string;
  title: string;
  order: number;
  published: boolean;
  exam_tags?: string[];
  is_core_for_exam?: boolean;
}>;
const offlineDetails = require('../../assets/offline-data/chapterdetails.json') as Array<{
  id: string;
  chapter_id: string;
  overview: string | null;
  sections: string[];
  keypoints: string[];
}>;

export type Subject = (typeof offlineSubjects)[number];
export type Chapter = (typeof offlineChapters)[number];
export type ChapterDetail = (typeof offlineDetails)[number];

async function fetchSubjects(): Promise<Subject[]> {
  const { data, error } = await supabase.from('subjects').select('*').order('level');
  if (error || !data?.length) return offlineSubjects;
  return data as Subject[];
}

async function fetchChapters(): Promise<Chapter[]> {
  const { data, error } = await supabase.from('chapters').select('*').order('order');
  if (error || !data?.length) return offlineChapters;
  return data as Chapter[];
}

async function fetchChapterDetails(): Promise<ChapterDetail[]> {
  const { data, error } = await supabase.from('chapterdetails').select('*');
  if (error || !data?.length) return offlineDetails;
  return data as ChapterDetail[];
}

let cached: {
  subjects: Subject[];
  chapters: Chapter[];
  chapterDetails: ChapterDetail[];
} | null = null;
let loadPromise: Promise<typeof cached> | null = null;

export async function getCatalogFromSupabase(): Promise<{
  subjects: Subject[];
  chapters: Chapter[];
  chapterDetails: ChapterDetail[];
}> {
  if (cached) return cached;
  if (!loadPromise) {
    loadPromise = (async () => {
      const timeout = (ms: number) =>
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Catalog timeout')), ms)
        );
      try {
        const [subjects, chapters, chapterDetails] = await Promise.race([
          Promise.all([
            fetchSubjects(),
            fetchChapters(),
            fetchChapterDetails(),
          ]),
          timeout(8000),
        ]);
        cached = { subjects, chapters, chapterDetails };
        return cached;
      } catch {
        return {
          subjects: offlineSubjects,
          chapters: offlineChapters,
          chapterDetails: offlineDetails,
        };
      } finally {
        loadPromise = null;
      }
    })();
  }
  const result = await loadPromise;
  return result ?? { subjects: offlineSubjects, chapters: offlineChapters, chapterDetails: offlineDetails };
}
