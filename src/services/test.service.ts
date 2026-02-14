import { supabase } from './supabase';

/**
 * Parse testId (ex: en-subj-en-romana, bac-subj-bac-matematica-real) into exam type and subject id.
 */
export const parseTestId = (testId: string): { examType: 'EN' | 'Bac'; subjectId: string } | null => {
  const enMatch = testId?.match(/^en-(.+)$/);
  if (enMatch) return { examType: 'EN', subjectId: enMatch[1] };
  const bacMatch = testId?.match(/^bac-(.+)$/);
  if (bacMatch) return { examType: 'Bac', subjectId: bacMatch[1] };
  return null;
};

/**
 * Creates a test record when starting an exam.
 */
export const createTestRecord = async (params: {
  userId: string;
  examType: 'EN' | 'Bac';
  subjectId: string;
}) => {
  const { data, error } = await supabase
    .from('tests')
    .insert({
      user_id: params.userId,
      type: params.examType,
      subject_set: [params.subjectId],
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single();
  return { testId: data?.id as string | null, error };
};

/**
 * Updates a test result.
 */
export const submitTestResult = async (testId: string, score: number) => {
  return supabase.from('tests').update({ score, finished_at: new Date().toISOString() }).eq('id', testId);
};

/**
 * Requests a generated test from Edge Function (legacy).
 */
export const generateTest = async (payload: {
  user_id: string;
  exam_type: 'EN' | 'Bac';
  level: string;
  subjects?: string[];
}) => {
  return supabase.functions.invoke('generate-test', { body: payload });
};
