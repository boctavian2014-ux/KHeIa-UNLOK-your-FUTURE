import { useState, useCallback } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { getGeneratedChapters } from '@/lib/chapterStorage';
import { useCatalogContext } from '@/components/common/CatalogProvider';

export default function SelectChapterScreen() {
  const { for: forParam } = useLocalSearchParams<{ for?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { subjects, chapters: chaptersData, loading } = useCatalogContext();
  const [generatedChapters, setGeneratedChapters] = useState<typeof chaptersData>([]);
  const isTheory = forParam === 'theory';
  const isQuiz = forParam === 'quiz';

  useFocusEffect(
    useCallback(() => {
      getGeneratedChapters().then(setGeneratedChapters);
    }, [])
  );

  const published = [
    ...chaptersData.filter((c) => c.published),
    ...generatedChapters,
  ];
  const getSubjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id;

  const title = isTheory
    ? 'Selectează capitol pentru teorie'
    : isQuiz
      ? 'Selectează capitol pentru quiz'
      : 'Selectează capitol';

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.dark.primary} />
      </View>
    );
  }

  const onSelect = (chapterId: string) => {
    if (isTheory) {
      router.replace(`/chapter/${chapterId}/theory`);
    } else if (isQuiz) {
      router.replace(`/chapter/${chapterId}/quiz`);
    } else {
      router.back();
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={16}>
        <Text style={styles.backText}>← Înapoi</Text>
      </Pressable>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>
        {isTheory
          ? 'Alege un capitol pentru a citi tot materialul de teorie.'
          : isQuiz
            ? 'Alege un capitol pentru a face quiz-ul (10 întrebări).'
            : 'Alege un capitol.'}
      </Text>

      <View style={styles.list}>
        {published.map((chapter) => (
          <Pressable
            key={chapter.id}
            onPress={() => onSelect(chapter.id)}
            style={({ pressed }) => [pressed && styles.cardPressed]}
          >
            <GlassCard dark intensity={18} style={styles.card}>
              <Text style={styles.cardTitle}>{chapter.title}</Text>
              <Text style={styles.cardMeta}>{getSubjectName(chapter.subject_id)}</Text>
              <Text style={styles.cardArrow}>→</Text>
            </GlassCard>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.contentBottom,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backRow: {
    marginBottom: spacing.md,
  },
  backText: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.dark.secondary,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.lg,
  },
  list: {
    gap: spacing.sm,
  },
  cardPressed: {
    opacity: 0.9,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(2, 6, 23, 0.78)',
    borderColor: 'rgba(148, 163, 184, 0.3)',
    borderWidth: 1,
  },
  cardTitle: {
    flex: 1,
    fontSize: typography.size.md,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardMeta: {
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.75)',
    marginRight: spacing.sm,
  },
  cardArrow: {
    fontSize: typography.size.lg,
    color: 'rgba(255,255,255,0.7)',
  },
});
