import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import type { Reward } from '@/services/gamification.service';

type RewardsPreviewProps = {
  rewards: Reward[];
  onViewAll: () => void;
};

export const RewardsPreview = ({ rewards, onViewAll }: RewardsPreviewProps) => {
  const topRewards = rewards.slice(0, 2);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Premii disponibile</Text>
        <Text style={styles.link} onPress={onViewAll}>
          Schimbă premii →
        </Text>
      </View>
      {topRewards.length === 0 ? (
        <Text style={styles.empty}>Nicio premiu disponibil momentan</Text>
      ) : (
        <View style={styles.list}>
          {topRewards.map((r) => (
            <View key={r.id} style={styles.card}>
              <Text style={styles.name}>{r.name}</Text>
              <Text style={styles.cost}>{r.coins_cost} monede</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.dark.text,
  },
  link: {
    fontSize: typography.size.sm,
    color: colors.dark.primary,
    fontWeight: '600',
  },
  list: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.dark.text,
  },
  cost: {
    fontSize: typography.size.sm,
    color: colors.dark.muted,
  },
  empty: {
    fontSize: typography.size.sm,
    color: colors.dark.muted,
  },
});
