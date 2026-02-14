import { addXP, awardCoins, updateStreak } from './gamification.service';

const XP_PER_QUESTION = 10;

export async function onQuizFinished(
  userId: string,
  chapterId: string,
  correctCount: number
) {
  const correct = Math.min(10, Math.max(0, correctCount));
  const gainedXP = correct * XP_PER_QUESTION;
  const coins = 5 + correct;

  await addXP(userId, gainedXP);
  await awardCoins(userId, coins, 'quiz', chapterId);
  await updateStreak(userId);
}

export async function onTestFinished(
  userId: string,
  testId: string,
  correctCount: number,
  totalCount: number
) {
  const correct = Math.max(0, correctCount);
  const total = Math.max(1, totalCount);
  const score = Math.round((correct / total) * 100);
  const coins = Math.floor(20 + (score / 100) * 30);
  const gainedXP = correct * XP_PER_QUESTION;

  await addXP(userId, gainedXP);
  await awardCoins(userId, coins, 'test', testId);
  await updateStreak(userId);
}
