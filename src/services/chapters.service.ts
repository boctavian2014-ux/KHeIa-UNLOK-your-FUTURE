import { supabase } from './supabase';

/**
 * Fetches chapters for a subject.
 * @param subjectId Subject id.
 * @returns Chapters list.
 */
export const getChapters = async (subjectId: string) => {
  return supabase.from('chapters').select('*').eq('subject_id', subjectId);
};
