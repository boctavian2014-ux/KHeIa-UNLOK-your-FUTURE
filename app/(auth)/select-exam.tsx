import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { setOnboardingExam, type ExamType } from '@/lib/onboardingStorage';

const EXAMS: { key: ExamType; title: string; desc: string }[] = [
  { key: 'EN', title: 'Evaluare Națională', desc: 'Clasa a VIII-a' },
  { key: 'BAC', title: 'Bacalaureat', desc: 'Clasa a XII-a' },
];

export default function SelectExamScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSelect = async (exam: ExamType) => {
    await setOnboardingExam(exam);
    router.push('/select-level');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
      <Text style={styles.title}>Selectează examenul</Text>
      <Text style={styles.subtitle}>Alege tipul de examen pentru care te pregătești</Text>

      <View style={styles.grid}>
        {EXAMS.map((exam) => (
          <Pressable
            key={exam.key}
            onPress={() => handleSelect(exam.key)}
            style={({ pressed }) => [styles.cardWrap, pressed && styles.cardPressed]}
          >
            <GlassCard dark intensity={14} style={styles.card}>
              <Text style={styles.cardTitle}>{exam.title}</Text>
              <Text style={styles.cardDesc}>{exam.desc}</Text>
            </GlassCard>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.dark.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: typography.size.md,
    color: colors.dark.muted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  grid: {
    gap: spacing.lg,
  },
  cardWrap: { marginBottom: spacing.sm },
  cardPressed: { opacity: 0.9 },
  card: {
    padding: spacing.xl,
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  cardTitle: {
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.dark.text,
  },
  cardDesc: {
    marginTop: spacing.tight,
    fontSize: typography.size.sm,
    color: colors.dark.muted,
  },
});
