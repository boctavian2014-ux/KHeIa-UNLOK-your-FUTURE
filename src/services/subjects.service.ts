import { supabase } from './supabase';

/**
 * Fetches subjects by level.
 * @param level Education level.
 * @returns Subjects list.
 */
export const getSubjects = async (level: 'gimnaziu' | 'liceu') => {
  return supabase.from('subjects').select('*').eq('level', level);
};
