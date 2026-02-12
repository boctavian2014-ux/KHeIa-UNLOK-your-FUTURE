import { supabase } from './supabase';

/**
 * Creates a new chapter with AI generation.
 * @param topic Chapter topic.
 * @param subjectId Subject id.
 * @param level Level.
 */
export const createChapter = async (topic: string, subjectId: string, level: 'gimnaziu' | 'liceu') => {
  return supabase.functions.invoke('generate-chapter-content', {
    body: { topic, subject_id: subjectId, level },
  });
};

/**
 * Generates chapter theory summary.
 * @param chapterId Chapter id.
 * @param topic Optional chapter title (for generated chapters not in Supabase).
 */
export const generateTheory = async (chapterId: string, topic?: string) => {
  return supabase.functions.invoke('generate-chapter-summary', {
    body: { chapter_id: chapterId, ...(topic && { topic }) },
  });
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
