import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { supabase } from '@/services/supabase';
import { awardCoins } from '@/services/gamification.service';

export default function TestResultScreen() {
  const { testId } = useLocalSearchParams<{ testId: string }>();

  useEffect(() => {
    if (!testId) return;
    const run = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) return;
      const { data: test } = await supabase.from('tests').select('score').eq('id', testId).single();
      if (!test?.score) return;
      const score = Math.min(100, Math.max(0, test.score));
      const coins = Math.floor(20 + (score / 100) * 30);
      await awardCoins(user.id, coins, 'test', testId);
    };
    run();
  }, [testId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rezultat test</Text>
      <Text style={styles.subtitle}>ID: {String(testId)}</Text>
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
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: typography.size.md,
    color: colors.dark.muted,
  },
});
