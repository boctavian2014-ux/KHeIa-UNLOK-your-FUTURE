import { useState } from 'react';
import { selectQuizQuestions } from '@/services/quiz.service';

export const useQuiz = () => {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [repeatedIds, setRepeatedIds] = useState<string[]>([]);

  const loadQuiz = async (chapterId: string, userId: string, count: number) => {
    const selection = await selectQuizQuestions(chapterId, userId, count);
    setItems(selection.items);
    setRepeatedIds(selection.repeatedIds);
  };

  return { items, repeatedIds, loadQuiz };
};
