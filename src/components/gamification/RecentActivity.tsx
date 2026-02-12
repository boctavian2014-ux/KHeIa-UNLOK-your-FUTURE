import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import type { CoinTransaction } from '@/services/gamification.service';

type RecentActivityProps = {
  transactions: CoinTransaction[];
};

const sourceLabels: Record<string, string> = {
  quiz: 'Quiz',
  test: 'Test',
  chapter: 'Capitol citit',
  daily: 'Login zilnic',
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return 'Azi';
  if (diff < 172800000) return 'Ieri';
  return d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
};

const getSourceLabel = (tx: CoinTransaction) => {
  if (tx.type === 'redeem') return 'Răscumpărare premiu';
  return sourceLabels[tx.source] ?? tx.source;
};

export const RecentActivity = ({ transactions }: RecentActivityProps) => {
  if (transactions.length === 0) {
    return (
      <Text style={styles.empty}>Nicio activitate recentă</Text>
    );
  }
  return (
    <View style={styles.list}>
      {transactions.map((tx) => (
        <View key={tx.id} style={styles.row}>
          <Text style={styles.label}>{getSourceLabel(tx)}</Text>
          <Text style={[styles.amount, tx.amount >= 0 ? styles.earn : styles.redeem]}>
            {tx.amount >= 0 ? '+' : ''}{tx.amount}
          </Text>
          <Text style={styles.date}>{formatDate(tx.created_at)}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.dark.text,
  },
  amount: {
    fontSize: typography.size.sm,
    fontWeight: '600',
  },
  earn: {
    color: colors.dark.success,
  },
  redeem: {
    color: colors.dark.danger,
  },
  date: {
    fontSize: typography.size.xs,
    color: colors.dark.muted,
    marginLeft: spacing.sm,
  },
  empty: {
    fontSize: typography.size.sm,
    color: colors.dark.muted,
  },
});
