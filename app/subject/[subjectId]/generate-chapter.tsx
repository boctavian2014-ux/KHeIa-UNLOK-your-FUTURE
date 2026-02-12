import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { getGeneratedChapters, addGeneratedChapter } from '@/lib/chapterStorage';
import { useCatalogContext } from '@/components/common/CatalogProvider';
import { createChapter } from '@/services/generator.service';

export default function GenerateChapterScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  const router = useRouter();
  const { subjects } = useCatalogContext();
  const [topic, setTopic] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const subject = subjects.find((s) => s.id === subjectId);

  const onGenerate = async () => {
    if (!topic.trim() || !subjectId) return;
    setSaving(true);
    try {
      const { data, error } = await createChapter(topic.trim(), subjectId, 'liceu');
      if (error) {
        Alert.alert('Eroare', error.message ?? 'Nu s-a putut genera capitolul.');
        return;
      }
      const existing = await getGeneratedChapters();
      const order = Math.max(0, ...existing.filter((c) => c.subject_id === subjectId).map((c) => c.order)) + 1;
      const id = `gen-${subjectId}-${Date.now()}`;
      await addGeneratedChapter({
        id,
        subject_id: subjectId,
        title: topic.trim(),
        order,
        published: true,
      });
      router.back();
    } catch (e) {
      Alert.alert('Eroare', e instanceof Error ? e.message : 'Eroare neașteptată.');
    } finally {
      setSaving(false);
    }
  };

  const canGenerate = topic.trim().length > 0 && !saving;

  if (!subject) {
    return (
      <View style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={16}>
          <Text style={styles.backText}>← Înapoi</Text>
        </Pressable>
        <Text style={styles.title}>Materie negăsită</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={16}>
        <Text style={styles.backText}>← Înapoi</Text>
      </Pressable>

      <Text style={styles.title}>Generează capitol</Text>
      <Text style={styles.subtitle}>
        {subject.name} – Capitolele generate vor apărea local în lista de capitole.
      </Text>

      <Text style={styles.label}>Topic / Tema capitolului</Text>
      <GlassCard dark intensity={14} style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="Ex: Fracții și procente, Ecuații de gradul I..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={topic}
          onChangeText={setTopic}
        />
      </GlassCard>

      <Pressable
        onPress={onGenerate}
        disabled={!canGenerate}
        style={[styles.generateBtn, !canGenerate && styles.generateBtnDisabled]}
      >
        <GlassCard dark intensity={18} style={styles.generateBtnInner}>
          <Text style={styles.generateBtnText}>{saving ? 'Se generează...' : 'Generează capitol'}</Text>
        </GlassCard>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: spacing.lg, paddingBottom: 120 },
  backRow: { marginBottom: spacing.md },
  backText: { fontSize: typography.size.md, fontWeight: '600', color: colors.dark.secondary },
  title: { fontSize: typography.size.xl, fontWeight: '700', color: '#ffffff', marginBottom: spacing.xs },
  subtitle: { fontSize: typography.size.sm, color: 'rgba(255,255,255,0.8)', marginBottom: spacing.lg },
  label: { fontSize: typography.size.sm, fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: spacing.sm },
  inputCard: {
    padding: spacing.md,
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
    marginBottom: spacing.lg,
  },
  input: { fontSize: typography.size.md, color: '#ffffff', padding: 0 },
  generateBtn: { marginTop: spacing.md },
  generateBtnDisabled: { opacity: 0.5 },
  generateBtnInner: {
    padding: spacing.md,
    backgroundColor: 'rgba(34, 197, 94, 0.25)',
    borderColor: 'rgba(34, 197, 94, 0.5)',
    alignItems: 'center',
  },
  generateBtnText: { fontSize: typography.size.md, fontWeight: '700', color: '#4ade80' },
});
