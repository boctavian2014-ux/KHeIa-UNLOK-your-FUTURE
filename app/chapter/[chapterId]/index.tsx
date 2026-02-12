import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ChapterScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/chapter/${chapterId}/theory`);
  }, [chapterId, router]);

  return null;
}
