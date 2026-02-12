import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { useCatalogContext } from '@/components/common/CatalogProvider';

export default function TestsScreen() {
  const router = useRouter();
  const { subjects, chapters: chaptersData, loading } = useCatalogContext();

  const published = chaptersData.filter((c) => c.published);
  const getSubjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? '';

  const enSubjects = subjects.filter((s) => (s.exam_tags ?? []).includes('EN'));
  const bacSubjects = subjects.filter((s) => (s.exam_tags ?? []).includes('BAC'));

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.dark.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Teste</Text>
      <Text style={styles.subtitle}>
        Quiz-uri pentru capitole și simulări EN/BAC conform programei.
      </Text>

      <Pressable
        onPress={() => router.push('/generator/generate-quiz')}
        style={({ pressed }) => [pressed && styles.cardPressed]}
      >
        <GlassCard dark intensity={16} style={styles.generateCard}>
          <Text style={styles.generateCardTitle}>+ Generează quiz și teste</Text>
          <Text style={styles.generateCardMeta}>
            Quiz-uri capitole, teste EN și BAC
          </Text>
          <Text style={styles.cardArrow}>→</Text>
        </GlassCard>
      </Pressable>

      <Text style={styles.sectionTitle}>Quiz-uri capitole</Text>
      <Text style={styles.sectionDesc}>Întrebări din fiecare capitol</Text>
      <View style={styles.list}>
        {published.slice(0, 12).map((ch) => (
          <Pressable
            key={ch.id}
            onPress={() => router.push(`/chapter/${ch.id}/quiz`)}
            style={({ pressed }) => [pressed && styles.cardPressed]}
          >
            <GlassCard dark intensity={16} style={styles.card}>
              <Text style={styles.cardTitle}>{ch.title}</Text>
              <Text style={styles.cardMeta}>{getSubjectName(ch.subject_id)}</Text>
              <Text style={styles.cardArrow}>→</Text>
            </GlassCard>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Evaluare Națională</Text>
      <Text style={styles.sectionDesc}>Simulări conform programei și formei de examen</Text>
      <View style={styles.list}>
        {enSubjects.map((s) => (
          <Pressable
            key={s.id}
            onPress={() => router.push(`/test/en-${s.id}`)}
            style={({ pressed }) => [pressed && styles.cardPressed]}
          >
            <GlassCard dark intensity={16} style={styles.card}>
              <Text style={styles.cardTitle}>Test EN · {s.name}</Text>
              <Text style={styles.cardMeta}>Simulare completă</Text>
              <Text style={styles.cardArrow}>→</Text>
            </GlassCard>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Bacalaureat</Text>
      <Text style={styles.sectionDesc}>Simulări conform programei și formei de examen</Text>
      <View style={styles.list}>
        {bacSubjects.map((s) => (
          <Pressable
            key={s.id}
            onPress={() => router.push(`/test/bac-${s.id}`)}
            style={({ pressed }) => [pressed && styles.cardPressed]}
          >
            <GlassCard dark intensity={16} style={styles.card}>
              <Text style={styles.cardTitle}>Test BAC · {s.name}</Text>
              <Text style={styles.cardMeta}>Simulare completă</Text>
              <Text style={styles.cardArrow}>→</Text>
            </GlassCard>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  content: { padding: spacing.lg, paddingBottom: 120 },
  title: { fontSize: typography.size.xl, fontWeight: '700', color: '#ffffff', marginBottom: spacing.xs },
  subtitle: { fontSize: typography.size.sm, color: 'rgba(255,255,255,0.8)', marginBottom: spacing.lg },
  generateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  generateCardTitle: { flex: 1, fontSize: typography.size.md, fontWeight: '700', color: '#60a5fa' },
  generateCardMeta: { fontSize: typography.size.sm, color: 'rgba(255,255,255,0.8)', marginRight: spacing.sm },
  sectionTitle: { fontSize: typography.size.lg, fontWeight: '700', color: '#ffffff', marginTop: spacing.lg, marginBottom: spacing.xs },
  sectionDesc: { fontSize: typography.size.sm, color: 'rgba(255,255,255,0.75)', marginBottom: spacing.sm },
  list: { gap: spacing.sm },
  cardPressed: { opacity: 0.9 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(2, 6, 23, 0.78)',
    borderColor: 'rgba(148, 163, 184, 0.3)',
    borderWidth: 1,
  },
  cardTitle: { flex: 1, fontSize: typography.size.md, fontWeight: '600', color: '#ffffff' },
  cardMeta: { fontSize: typography.size.sm, color: 'rgba(255,255,255,0.75)', marginRight: spacing.sm },
  cardArrow: { fontSize: typography.size.lg, color: 'rgba(255,255,255,0.7)' },
});
