import type { CoinTransaction } from './gamification.service';

export type DailyMissionType =
  | 'QUIZ_EN'
  | 'QUIZ_BAC'
  | 'TEST_EN'
  | 'TEST_BAC'
  | 'ANY_QUIZ'
  | 'ANY_TEST';

export type DailyMission = {
  id: string;
  text: string;
  type: DailyMissionType;
};

export type ExamContext = 'EN' | 'BAC' | 'ANY';

export function generateDailyMissions(
  streak: number,
  transactions: CoinTransaction[],
  examContext: ExamContext
): DailyMission[] {
  const missions: DailyMission[] = [];

  // Misiune 1: streak / activare
  if (streak <= 2) {
    missions.push({
      id: 'start-streak',
      text: 'Fă azi cel puțin 1 quiz pentru a începe streak-ul.',
      type: 'ANY_QUIZ',
    });
  } else if (streak < 7) {
    missions.push({
      id: 'keep-streak',
      text: 'Rezolvă azi 2 quiz-uri ca să-ți menții streak-ul.',
      type: 'ANY_QUIZ',
    });
  } else {
    missions.push({
      id: 'long-streak',
      text: 'Completează azi 1 test și 1 quiz pentru un streak puternic.',
      type: 'ANY_TEST',
    });
  }

  // Misiune 2: în funcție de examContext
  if (examContext === 'EN') {
    missions.push({
      id: 'en-2-quizzes',
      text: 'Rezolvă 2 quiz-uri la EN (Română sau Mate).',
      type: 'QUIZ_EN',
    });
  } else if (examContext === 'BAC') {
    missions.push({
      id: 'bac-3-quizzes',
      text: 'Rezolvă 3 quiz-uri la BAC, la materii diferite.',
      type: 'QUIZ_BAC',
    });
  } else {
    missions.push({
      id: 'any-quiz',
      text: 'Rezolvă azi cel puțin 3 quiz-uri la materiile tale preferate.',
      type: 'ANY_QUIZ',
    });
  }

  // Misiune 3: pe monedele câștigate azi
  const todayCoins = getTodayCoins(transactions);
  if (todayCoins < 30) {
    missions.push({
      id: 'coins-30',
      text: 'Strânge azi cel puțin 30 de monede din quiz-uri și teste.',
      type: 'ANY_TEST',
    });
  } else {
    missions.push({
      id: 'coins-50',
      text: 'Încearcă să ajungi la 50 de monede câștigate azi.',
      type: 'ANY_TEST',
    });
  }

  return missions;
}

function getTodayCoins(transactions: CoinTransaction[]): number {
  const today = new Date();
  return transactions
    .filter((tx) => tx.type === 'earn' && isSameDay(new Date(tx.created_at), today))
    .reduce((sum, tx) => sum + tx.amount, 0);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
