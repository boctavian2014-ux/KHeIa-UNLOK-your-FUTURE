import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { colors, spacing, typography } from '@/theme';
import { ConfettiOverlay } from '@/components/ui/ConfettiOverlay';
import { supabase } from '@/services/supabase';
import { updateSubscriptionAfterPurchase } from '@/services/subscription.service';

const PLAN_LABELS: Record<string, string> = {
  monthly: 'Lunar',
  yearly: 'Anual',
  full_edumat: 'Full Edumat',
};

export default function SubscriptionSuccessScreen() {
  const { plan } = useLocalSearchParams<{ plan: string }>();
  const router = useRouter();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const run = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id || !plan) return;

      const periodEnd = new Date();
      if (plan === 'monthly') periodEnd.setMonth(periodEnd.getMonth() + 1);
      else if (plan === 'yearly') periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      else periodEnd.setFullYear(periodEnd.getFullYear() + 10);

      await updateSubscriptionAfterPurchase(
        user.id,
        plan as 'monthly' | 'yearly' | 'full_edumat',
        periodEnd.toISOString()
      );
      setDone(true);

      setTimeout(() => router.replace('/(tabs)'), 2500);
    };
    run();
  }, [plan, router]);

  return (
    <View style={styles.container}>
      {done && <ConfettiOverlay />}
      <Animated.View entering={FadeIn.duration(400)} style={styles.content}>
        <Animated.Text entering={FadeInDown.delay(200).duration(500)} style={styles.emoji}>
          🎉
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(400).duration(500)} style={styles.title}>
          Felicitări!
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(600).duration(500)} style={styles.subtitle}>
          {done
            ? `Ai activat KhEIa ${PLAN_LABELS[plan ?? ''] ?? 'Premium'}. Accesul complet este deblocat!`
            : 'Se procesează...'}
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  content: { alignItems: 'center', padding: spacing.xl },
  emoji: { fontSize: 80, marginBottom: spacing.lg },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: '700',
    color: colors.dark.text,
  },
  subtitle: {
    marginTop: spacing.md,
    fontSize: typography.size.lg,
    color: colors.dark.muted,
    textAlign: 'center',
  },
});
