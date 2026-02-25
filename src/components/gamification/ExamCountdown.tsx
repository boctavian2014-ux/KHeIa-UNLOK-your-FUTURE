import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';

export type ExamType = 'EN' | 'BAC';

const EXAM_DATES_2026: Record<ExamType, Date> = {
  EN: new Date(2026, 5, 22), // 22 iunie 2026
  BAC: new Date(2026, 5, 29), // 29 iunie 2026
};

const EXAM_LABELS: Record<ExamType, string> = {
  EN: 'Evaluare Națională 2026',
  BAC: 'Bacalaureat 2026',
};

function getDaysRemaining(target: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const t = new Date(target);
  t.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((t.getTime() - now.getTime()) / 86400000));
}

type ExamCountdownProps = {
  examType: ExamType;
  compact?: boolean;
};

export function ExamCountdown({ examType, compact = false }: ExamCountdownProps) {
  const target = EXAM_DATES_2026[examType];
  const days = getDaysRemaining(target);
  const label = EXAM_LABELS[examType];

  if (compact) {
    return (
      <View style={styles.compact}>
        <Text style={styles.compactLabel}>{label}</Text>
        <Text style={styles.compactDays}>{days} zile</Text>
      </View>
    );
  }

  return (
    <GlassCard dark intensity={18} style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.days}>{days}</Text>
      <Text style={styles.suffix}>{days === 1 ? 'zi rămasă' : 'zile rămase'}</Text>
    </GlassCard>
  );
}

/**
 * Dual countdown for both EN and BAC.
 */
export function ExamCountdownDual() {
  const enDays = getDaysRemaining(EXAM_DATES_2026.EN);
  const bacDays = getDaysRemaining(EXAM_DATES_2026.BAC);

  return (
    <View style={styles.dual}>
      <GlassCard dark intensity={18} style={styles.dualCard}>
        <Text style={styles.dualLabel}>Evaluare Națională</Text>
        <Text style={styles.dualDays}>{enDays}</Text>
        <Text style={styles.dualSuffix}>zile</Text>
      </GlassCard>
      <GlassCard dark intensity={18} style={styles.dualCard}>
        <Text style={styles.dualLabel}>Bacalaureat</Text>
        <Text style={styles.dualDays}>{bacDays}</Text>
        <Text style={styles.dualSuffix}>zile</Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  label: {
    fontSize: typography.size.sm,
    color: colors.dark.muted,
    marginBottom: spacing.xs,
  },
  days: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.dark.primary,
  },
  suffix: {
    fontSize: typography.size.sm,
    color: colors.dark.muted,
    marginTop: spacing.xs,
  },
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  compactLabel: {
    fontSize: typography.size.sm,
    color: colors.dark.muted,
  },
  compactDays: {
    fontSize: typography.size.md,
    fontWeight: '700',
    color: colors.dark.primary,
  },
  dual: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dualCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  dualLabel: {
    fontSize: typography.size.xs ?? 12,
    color: colors.dark.muted,
    marginBottom: spacing.xs,
  },
  dualDays: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark.primary,
  },
  dualSuffix: {
    fontSize: typography.size.xs ?? 12,
    color: colors.dark.muted,
    marginTop: spacing.xs,
  },
});
