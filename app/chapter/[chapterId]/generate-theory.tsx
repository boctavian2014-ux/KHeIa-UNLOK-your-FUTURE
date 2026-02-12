import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { getGeneratedChapters, setGeneratedTheory } from '@/lib/chapterStorage';
import { useCatalogContext } from '@/components/common/CatalogProvider';
import { generateTheory } from '@/services/generator.service';

export default function GenerateTheoryScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const router = useRouter();
  const { chapters: chaptersData } = useCatalogContext();
  const [generating, setGenerating] = useState(false);
  const [generatedChapters, setGeneratedChapters] = useState<typeof chaptersData>([]);

  useFocusEffect(
    useCallback(() => {
      getGeneratedChapters().then(setGeneratedChapters);
    }, [])
  );

  const chapter =
    chaptersData.find((c) => c.id === chapterId) ??
    generatedChapters.find((c) => c.id === chapterId);

  const handleGenerate = async () => {
    if (!chapterId) return;
    setGenerating(true);
    try {
      const { data, error } = await generateTheory(chapterId, chapter?.title);
      if (error) {
        Alert.alert('Eroare', error.message ?? 'Nu s-a putut genera teoria.');
        return;
      }
      const payload = data as { content?: string } | null;
      const content = payload?.content?.trim();
      if (content) {
        await setGeneratedTheory(chapterId, [content]);
      }
      router.replace(`/chapter/${chapterId}/theory`);
    } catch (e) {
      Alert.alert('Eroare', e instanceof Error ? e.message : 'Eroare neașteptată.');
    } finally {
      setGenerating(false);
    }
  };

  if (!chapter) {
    return (
      <View style={styles.container}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
          style={styles.backRow}
          hitSlop={24}
        >
          <Text style={styles.backText}>← Înapoi</Text>
        </Pressable>
        <Text style={styles.title}>Capitol negăsit</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={() => router.replace(`/chapter/${chapterId}/theory`)}
        style={styles.backRow}
        hitSlop={24}
      >
        <Text style={styles.backText}>← Înapoi</Text>
      </Pressable>

      <Text style={styles.screenTitle}>Generează teorie</Text>
      <Text style={styles.chapterTitle}>{chapter.title}</Text>

      <GlassCard dark intensity={14} style={styles.infoCard}>
        <Text style={styles.infoText}>
          KhEla poate genera teoria pentru acest capitol. După generare, teoria va apărea în secțiunile
          capitolului (ex. Genuri, Specii).
        </Text>
      </GlassCard>

      <Pressable
        onPress={handleGenerate}
        disabled={generating}
        style={({ pressed }) => [styles.generateBtn, pressed && styles.generateBtnPressed]}
      >
        <GlassCard dark intensity={14} style={styles.generateBtnInner}>
          <Text style={styles.generateBtnText}>
            {generating ? 'Se generează...' : 'Generează teorie'}
          </Text>
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
    paddingBottom: 120,
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
  chapterTitle: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: spacing.lg,
  },
  infoCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  infoText: {
    fontSize: typography.size.md,
    color: '#ffffff',
    lineHeight: 22,
  },
  generateBtn: { marginBottom: spacing.md },
  generateBtnPressed: { opacity: 0.9 },
  generateBtnInner: {
    padding: spacing.md,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
  },
  generateBtnText: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: '#60a5fa',
  },
});
