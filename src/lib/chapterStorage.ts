import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'generated-chapters';
const THEORY_KEY = 'generated-theory';

export type StoredChapter = {
  id: string;
  subject_id: string;
  title: string;
  order: number;
  published: boolean;
};

export async function getGeneratedChapters(): Promise<StoredChapter[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function addGeneratedChapter(chapter: StoredChapter): Promise<void> {
  const list = await getGeneratedChapters();
  list.push(chapter);
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export async function getGeneratedTheory(chapterId: string): Promise<string[] | null> {
  try {
    const raw = await AsyncStorage.getItem(`${THEORY_KEY}:${chapterId}`);
    if (!raw) return null;
    const data = JSON.parse(raw) as { section_contents: string[] };
    return data.section_contents ?? null;
  } catch {
    return null;
  }
}

export async function setGeneratedTheory(chapterId: string, sectionContents: string[]): Promise<void> {
  await AsyncStorage.setItem(
    `${THEORY_KEY}:${chapterId}`,
    JSON.stringify({ section_contents: sectionContents })
  );
}
