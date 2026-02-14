import { useState, useCallback } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { getGeneratedChapters, getGeneratedTheory } from '@/lib/chapterStorage';
import { useCatalogContext } from '@/components/common/CatalogProvider';

const chapterTheoryData = require('../../../assets/offline-data/chaptertheory.json') as Array<{
  chapter_id: string;
  section_contents: string[];
}>;

export default function ChapterTheoryScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { chapters: chaptersData, chapterDetails: chapterDetailsData, loading } = useCatalogContext();
  const [generatedChapters, setGeneratedChapters] = useState<typeof chaptersData>([]);
  const [generatedTheory, setGeneratedTheoryState] = useState<string[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      getGeneratedChapters().then(setGeneratedChapters);
      if (chapterId) getGeneratedTheory(chapterId).then(setGeneratedTheoryState);
    }, [chapterId])
  );

  const chapter =
    chaptersData.find((c) => c.id === chapterId) ??
    generatedChapters.find((c) => c.id === chapterId);
  const details = chapterDetailsData.find((d) => d.chapter_id === chapterId);
  const theoryEntry = chapterTheoryData.find((t) => t.chapter_id === chapterId);
  const sectionContents =
    generatedTheory ?? theoryEntry?.section_contents ?? [];
  const sections = details?.sections ?? [];
  const keypoints = details?.keypoints ?? [];
  const hasFullChapter = sectionContents.length > 0;

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.dark.primary} />
      </View>
    );
  }

  if (!chapter) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={16}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Capitol negăsit</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(tabs)/home');
          }
        }}
        style={styles.backRow}
        hitSlop={24}
      >
        <Text style={styles.backText}>← Înapoi</Text>
      </Pressable>

      <Text style={styles.screenTitle}>Teorie</Text>
      <Text style={styles.chapterTitle}>{chapter.title}</Text>

      <Pressable
        onPress={() => router.push(`/chapter/${chapterId}/generate-theory`)}
        style={({ pressed }) => [styles.generateTheoryBtn, pressed && styles.generateTheoryBtnPressed]}
      >
        <GlassCard dark intensity={14} style={styles.generateTheoryBtnInner}>
          <Text style={styles.generateTheoryBtnText}>+ Generează teorie</Text>
        </GlassCard>
      </Pressable>

      {hasFullChapter ? (
        sections.length > 0 ? (
          sections.map((sectionTitle, i) => (
            <GlassCard key={i} dark intensity={14} style={styles.blockCard}>
              <Text style={styles.sectionHeading}>{sectionTitle}</Text>
              <Text style={styles.blockText}>
                {sectionContents[i] ?? 'Conținut în pregătire.'}
              </Text>
            </GlassCard>
          ))
        ) : (
          sectionContents.map((text, i) => (
            <GlassCard key={i} dark intensity={14} style={styles.blockCard}>
              <Text style={styles.blockText}>{text}</Text>
            </GlassCard>
          ))
        )
      ) : (
        <>
          {sections.length > 0 ? (
            sections.map((sectionTitle, i) => (
              <GlassCard key={i} dark intensity={14} style={styles.blockCard}>
                <Text style={styles.sectionHeading}>{sectionTitle}</Text>
                <Text style={styles.blockText}>
                  Materialul detaliat pentru această secțiune va fi adăugat în curând.
                  {keypoints.length > 0 ? ` Puncte cheie: ${keypoints.join(', ')}.` : ''}
                </Text>
              </GlassCard>
            ))
          ) : null}
          {keypoints.length > 0 && (
            <GlassCard dark intensity={14} style={styles.blockCard}>
              <Text style={styles.blockLabel}>Puncte cheie</Text>
              {keypoints.map((k, i) => (
                <View key={i} style={styles.keypointRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.keypointText}>{k}</Text>
                </View>
              ))}
            </GlassCard>
          )}
        </>
      )}

      <Pressable
        onPress={() => router.push(`/chapter/${chapterId}/quiz`)}
        style={({ pressed }) => [styles.quizButton, pressed && styles.doneButtonPressed]}
      >
        <GlassCard dark intensity={14} style={styles.quizButtonInner}>
          <Text style={styles.quizButtonText}>Quiz – Verifică cunoștințele</Text>
        </GlassCard>
      </Pressable>
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
    marginBottom: spacing.sm,
  },
  backText: {
    fontSize: 28,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  screenTitle: {
    fontSize: typography.size.sm,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  generateTheoryBtn: { marginBottom: spacing.md },
  generateTheoryBtnPressed: { opacity: 0.9 },
  generateTheoryBtnInner: {
    padding: spacing.md,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
  },
  generateTheoryBtnText: { fontSize: typography.size.md, fontWeight: '600', color: '#60a5fa' },
  chapterTitle: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: spacing.lg,
  },
  blockCard: {
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
    padding: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.md,
  },
  blockLabel: {
    fontSize: typography.size.sm,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  sectionHeading: {
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: spacing.sm,
  },
  blockText: {
    fontSize: typography.size.md,
    color: '#ffffff',
    lineHeight: 22,
  },
  keypointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.xs,
  },
  bullet: {
    color: 'rgba(255,255,255,0.8)',
    marginRight: spacing.sm,
    fontSize: typography.size.md,
  },
  keypointText: {
    flex: 1,
    fontSize: typography.size.md,
    color: '#ffffff',
  },
  quizButton: { marginTop: spacing.lg },
  quizButtonInner: {
    padding: spacing.md,
    backgroundColor: 'rgba(34, 197, 94, 0.25)',
    borderColor: 'rgba(34, 197, 94, 0.5)',
    alignItems: 'center',
  },
  quizButtonText: { fontSize: typography.size.md, fontWeight: '700', color: '#4ade80' },
  doneButtonPressed: {
    opacity: 0.9,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.dark.text,
  },
});
