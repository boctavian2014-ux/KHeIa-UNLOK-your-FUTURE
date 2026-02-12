import { supabase } from './supabase';

/**
 * Requests a generated test from Edge Function.
 * @param payload Test request payload.
 */
export const generateTest = async (payload: {
  user_id: string;
  exam_type: 'EN' | 'Bac';
  level: string;
  subjects?: string[];
}) => {
  return supabase.functions.invoke('generate-test', { body: payload });
};

/**
 * Updates a test result.
 * @param testId Test id.
 * @param score Score value.
 */
export const submitTestResult = async (testId: string, score: number) => {
  return supabase.from('tests').update({ score, finished_at: new Date().toISOString() }).eq('id', testId);
};
