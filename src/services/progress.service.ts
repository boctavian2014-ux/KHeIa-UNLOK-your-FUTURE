import { supabase } from './supabase';

export type UserChapterProgressRow = {
  id: string;
  user_id: string;
  chapter_id: string;
  status: string;
  last_quiz_score: number | null;
  updated_at: string;
};

/**
 * Fetches user chapter progress from Supabase.
 */
export async function getUserChapterProgress(
  userId: string
): Promise<UserChapterProgressRow[]> {
  const { data, error } = await supabase
    .from('userchapterprogress')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as UserChapterProgressRow[];
}
