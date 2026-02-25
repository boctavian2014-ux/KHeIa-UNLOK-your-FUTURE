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

/** Hash simplu pentru seed zilnic - același rezultat pentru aceeași dată */
function dayHash(date: Date): number {
  const str = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Alege un element din array bazat pe seed (determinist) */
function pickBySeed<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export function generateDailyMissions(
  streak: number,
  transactions: CoinTransaction[],
  examContext: ExamContext
): DailyMission[] {
  const today = new Date();
  const baseSeed = dayHash(today);
  const missions: DailyMission[] = [];

  // Misiune 1: streak / activare – variante zilnice
  const slot1Seed = baseSeed + 1;
  if (streak <= 2) {
    const options: DailyMission[] = [
      { id: 'start-streak-1', text: 'Fă azi cel puțin 1 quiz pentru a începe streak-ul.', type: 'ANY_QUIZ' },
      { id: 'start-streak-2', text: 'Completează un quiz azi și pornește-ți streak-ul.', type: 'ANY_QUIZ' },
      { id: 'start-streak-3', text: 'Începe streak-ul: rezolvă 1 quiz astăzi.', type: 'ANY_QUIZ' },
    ];
    missions.push(pickBySeed(options, slot1Seed));
  } else if (streak < 7) {
    const options: DailyMission[] = [
      { id: 'keep-streak-1', text: 'Rezolvă azi 2 quiz-uri ca să-ți menții streak-ul.', type: 'ANY_QUIZ' },
      { id: 'keep-streak-2', text: 'Menține streak-ul: fă 2 quiz-uri astăzi.', type: 'ANY_QUIZ' },
      { id: 'keep-streak-3', text: '2 quiz-uri azi = streak-ul tău continuă.', type: 'ANY_QUIZ' },
    ];
    missions.push(pickBySeed(options, slot1Seed));
  } else {
    const options: DailyMission[] = [
      { id: 'long-streak-1', text: 'Completează azi 1 test și 1 quiz pentru un streak puternic.', type: 'ANY_TEST' },
      { id: 'long-streak-2', text: 'Streak mare: fă 1 test + 1 quiz astăzi.', type: 'ANY_TEST' },
      { id: 'long-streak-3', text: 'Păstrează momentum-ul: 1 test și 1 quiz azi.', type: 'ANY_TEST' },
    ];
    missions.push(pickBySeed(options, slot1Seed));
  }

  // Misiune 2: examContext – variante zilnice
  const slot2Seed = baseSeed + 2;
  if (examContext === 'EN') {
    const options: DailyMission[] = [
      { id: 'en-1', text: 'Rezolvă 2 quiz-uri la EN (Română sau Mate).', type: 'QUIZ_EN' },
      { id: 'en-2', text: '2 quiz-uri EN astăzi – Română sau Matematică.', type: 'QUIZ_EN' },
      { id: 'en-3', text: 'Exersează EN: fă 2 quiz-uri la Română sau Mate.', type: 'QUIZ_EN' },
    ];
    missions.push(pickBySeed(options, slot2Seed));
  } else if (examContext === 'BAC') {
    const options: DailyMission[] = [
      { id: 'bac-1', text: 'Rezolvă 3 quiz-uri la BAC, la materii diferite.', type: 'QUIZ_BAC' },
      { id: 'bac-2', text: '3 quiz-uri BAC azi, pe materii diverse.', type: 'QUIZ_BAC' },
      { id: 'bac-3', text: 'Exersează BAC: 3 quiz-uri la 3 materii diferite.', type: 'QUIZ_BAC' },
    ];
    missions.push(pickBySeed(options, slot2Seed));
  } else {
    const options: DailyMission[] = [
      { id: 'any-1', text: 'Rezolvă azi cel puțin 3 quiz-uri la materiile tale preferate.', type: 'ANY_QUIZ' },
      { id: 'any-2', text: '3 quiz-uri azi – alege materiile care te interesează.', type: 'ANY_QUIZ' },
      { id: 'any-3', text: 'Fă 3 quiz-uri astăzi la orice materie.', type: 'ANY_QUIZ' },
    ];
    missions.push(pickBySeed(options, slot2Seed));
  }

  // Misiune 3: monede – variante zilnice
  const todayCoins = getTodayCoins(transactions);
  const slot3Seed = baseSeed + 3;
  if (todayCoins < 30) {
    const options: DailyMission[] = [
      { id: 'coins-30-1', text: 'Strânge azi cel puțin 30 de monede din quiz-uri și teste.', type: 'ANY_TEST' },
      { id: 'coins-30-2', text: 'Obiectiv: 30 monede câștigate astăzi.', type: 'ANY_TEST' },
      { id: 'coins-30-3', text: 'Câștigă 30+ monede azi din quiz-uri și teste.', type: 'ANY_TEST' },
    ];
    missions.push(pickBySeed(options, slot3Seed));
  } else {
    const options: DailyMission[] = [
      { id: 'coins-50-1', text: 'Încearcă să ajungi la 50 de monede câștigate azi.', type: 'ANY_TEST' },
      { id: 'coins-50-2', text: 'Obiectiv ambițios: 50 monede astăzi.', type: 'ANY_TEST' },
      { id: 'coins-50-3', text: 'Strânge 50 de monede din activități azi.', type: 'ANY_TEST' },
    ];
    missions.push(pickBySeed(options, slot3Seed));
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
