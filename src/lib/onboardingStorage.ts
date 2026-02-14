import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_DONE = 'onboarding_done';
const KEY_EXAM = 'onboarding_exam';
const KEY_LEVEL = 'onboarding_level';

export type ExamType = 'EN' | 'BAC';
export type LevelType = 'gimnaziu' | 'liceu';

export async function getOnboardingDone(): Promise<boolean> {
  try {
    const v = await AsyncStorage.getItem(KEY_DONE);
    return v === 'true';
  } catch {
    return false;
  }
}

export async function setOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(KEY_DONE, 'true');
}

export async function getOnboardingExam(): Promise<ExamType | null> {
  try {
    const v = await AsyncStorage.getItem(KEY_EXAM);
    if (v === 'EN' || v === 'BAC') return v;
    return null;
  } catch {
    return null;
  }
}

export async function setOnboardingExam(exam: ExamType): Promise<void> {
  await AsyncStorage.setItem(KEY_EXAM, exam);
}

export async function getOnboardingLevel(): Promise<LevelType | null> {
  try {
    const v = await AsyncStorage.getItem(KEY_LEVEL);
    if (v === 'gimnaziu' || v === 'liceu') return v;
    return null;
  } catch {
    return null;
  }
}

export async function setOnboardingLevel(level: LevelType): Promise<void> {
  await AsyncStorage.setItem(KEY_LEVEL, level);
}
