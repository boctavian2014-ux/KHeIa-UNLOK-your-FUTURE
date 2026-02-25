import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { getRewardsCatalog, redeemReward, type Reward } from '@/services/gamification.service';
import { supabase } from '@/services/supabase';

export default function RewardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    getRewardsCatalog().then(setRewards).finally(() => setLoading(false));
  }, []);

  const handleRedeem = async (reward: Reward) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      Alert.alert('Autentificare', 'Autentifică-te pentru a schimba premii.');
      return;
    }
    setRedeeming(reward.id);
    const result = await redeemReward(user.id, reward.id);
    setRedeeming(null);
    Alert.alert(result.success ? 'Succes' : 'Info', result.error ?? (result.success ? 'Premiul a fost răscumpărat!' : 'Eroare'));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Înapoi</Text>
      </Pressable>
      <Text style={styles.title}>Schimbă premii</Text>
      <Text style={styles.subtitle}>Folosește monedele câștigate din quiz-uri și teste</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.dark.primary} style={styles.loader} />
      ) : rewards.length === 0 ? (
        <Text style={styles.placeholder}>Premiile vor fi disponibile în curând. Va urma.</Text>
      ) : (
        <View style={styles.list}>
          {rewards.map((r) => (
            <GlassCard key={r.id} dark intensity={18} style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{r.name}</Text>
                  {r.description && (
                    <Text style={styles.cardDesc}>{r.description}</Text>
                  )}
                  <Text style={styles.cardCost}>🪙 {r.coins_cost} monede</Text>
                </View>
                <Pressable
                  onPress={() => handleRedeem(r)}
                  disabled={!!redeeming}
                  style={({ pressed }) => [styles.redeemBtn, pressed && styles.redeemBtnPressed]}
                >
                  <Text style={styles.redeemBtnText}>
                    {redeeming === r.id ? '...' : 'Schimbă'}
                  </Text>
                </Pressable>
              </View>
            </GlassCard>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: 'transparent',
  },
  content: {
    paddingBottom: spacing.contentBottom,
  },
  back: {
    marginBottom: spacing.md,
  },
  backText: {
    fontSize: typography.size.md,
    color: colors.dark.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.dark.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: typography.size.sm,
    color: colors.dark.muted,
  },
  loader: {
    marginTop: spacing.xl,
  },
  placeholder: {
    marginTop: spacing.xl,
    fontSize: typography.size.md,
    color: colors.dark.muted,
    fontStyle: 'italic',
  },
  list: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  card: {
    padding: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: typography.size.md,
    fontWeight: '700',
    color: colors.dark.text,
  },
  cardDesc: {
    marginTop: spacing.xs,
    fontSize: typography.size.sm,
    color: colors.dark.muted,
  },
  cardCost: {
    marginTop: spacing.xs,
    fontSize: typography.size.sm,
    color: colors.dark.primary,
    fontWeight: '600',
  },
  redeemBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 12,
  },
  redeemBtnPressed: {
    opacity: 0.9,
  },
  redeemBtnText: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: '#60a5fa',
  },
});
