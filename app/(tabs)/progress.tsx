import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { useGamification } from '@/hooks/useGamification';
import { getRewardsCatalog } from '@/services/gamification.service';
import type { Reward } from '@/services/gamification.service';
import { XPBar } from '@/components/gamification/XPBar';
import { StreakCounter } from '@/components/gamification/StreakCounter';
import { CoinsDisplay } from '@/components/gamification/CoinsDisplay';
import { DailyMission } from '@/components/gamification/DailyMission';
import { RecentActivity } from '@/components/gamification/RecentActivity';
import { RewardsPreview } from '@/components/gamification/RewardsPreview';

const DAILY_MISSIONS = [
  'Fă un quiz la capitolul citit',
  'Citește un capitol',
  'Completează un test EN/BAC',
];

export default function ProgressScreen() {
  const router = useRouter();
  const { coins, level, xpProgress, streak, transactions, loading, userId, refresh } =
    useGamification();
  const [rewards, setRewards] = useState<Reward[]>([]);

  const loadRewards = useCallback(async () => {
    const data = await getRewardsCatalog();
    setRewards(data);
  }, []);

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.dark.primary} />
      </View>
    );
  }

  const initial = userId ? 'U' : '?';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Progres</Text>
      <Text style={styles.subtitle}>XP, streak și misiuni zilnice.</Text>

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.level}>Nivel {level}</Text>
          <XPBar progress={xpProgress} />
        </View>
      </View>

      <View style={styles.coinsRow}>
        <CoinsDisplay coins={coins} />
      </View>

      <View style={styles.streakRow}>
        <StreakCounter streak={streak} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Misiuni zilnice</Text>
        {DAILY_MISSIONS.map((m, i) => (
          <View key={i} style={styles.missionWrap}>
            <DailyMission text={m} />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ultimele activități</Text>
        <RecentActivity transactions={transactions} />
      </View>

      <RewardsPreview rewards={rewards} onViewAll={() => router.push('/rewards')} />

      <View style={styles.bottom} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: 'transparent',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingBottom: 110,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.dark.text,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: typography.size.md,
    color: colors.dark.muted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: '#fff',
  },
  headerRight: {
    flex: 1,
    marginLeft: spacing.md,
  },
  level: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: spacing.xs,
  },
  coinsRow: {
    marginTop: spacing.md,
  },
  streakRow: {
    marginTop: spacing.md,
  },
  section: {
    marginTop: spacing.xl,
  },
  missionWrap: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.dark.text,
    marginBottom: spacing.sm,
  },
  bottom: {
    height: spacing.lg,
  },
});
