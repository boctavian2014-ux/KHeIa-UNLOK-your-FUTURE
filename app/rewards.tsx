import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { useGamification } from '@/hooks/useGamification';
import { getRewardsCatalog, redeemReward } from '@/services/gamification.service';
import type { Reward } from '@/services/gamification.service';

export default function RewardsScreen() {
  const router = useRouter();
  const { coins, userId, refresh } = useGamification();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  const loadRewards = useCallback(async () => {
    const data = await getRewardsCatalog();
    setRewards(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  const handleRedeem = async (reward: Reward) => {
    if (!userId) {
      Alert.alert('Autentificare', 'Trebuie să fii autentificat pentru a schimba premii.');
      return;
    }
    if (coins < reward.coins_cost) {
      Alert.alert('Monede insuficiente', `Ai nevoie de ${reward.coins_cost} monede. Ai ${coins}.`);
      return;
    }
    Alert.alert(
      'Confirmare',
      `Schimbi "${reward.name}" pentru ${reward.coins_cost} monede?`,
      [
        { text: 'Anulează', style: 'cancel' },
        {
          text: 'Schimbă',
          onPress: async () => {
            setRedeeming(reward.id);
            const result = await redeemReward(userId, reward.id);
            setRedeeming(null);
            if (result.success && result.voucherCode) {
              Alert.alert(
                'Felicitări!',
                `Codul tău: ${result.voucherCode}\n\nPrezintă acest cod la ${reward.partner_name ?? 'partener'} pentru a-ți primi premiul.`
              );
              await refresh();
            } else {
              Alert.alert('Eroare', result.error ?? 'Nu s-a putut finaliza răscumpărarea.');
            }
          },
        },
      ]
    );
  };

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
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Înapoi</Text>
      </Pressable>
      <Text style={styles.title}>Schimbă premii</Text>
      <Text style={styles.coins}>Ai {coins} monede</Text>

      {rewards.length === 0 ? (
        <Text style={styles.empty}>Nicio premiu disponibil momentan</Text>
      ) : (
        <View style={styles.list}>
          {rewards.map((r) => (
            <View key={r.id} style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.name}>{r.name}</Text>
                {r.description ? (
                  <Text style={styles.desc}>{r.description}</Text>
                ) : null}
                {r.partner_name ? (
                  <Text style={styles.partner}>{r.partner_name}</Text>
                ) : null}
                {r.partner_location ? (
                  <Text style={styles.location}>{r.partner_location}</Text>
                ) : null}
                <Text style={styles.cost}>{r.coins_cost} monede</Text>
              </View>
              <Pressable
                onPress={() => handleRedeem(r)}
                disabled={redeeming === r.id || coins < r.coins_cost}
                style={({ pressed }) => [
                  styles.button,
                  (coins < r.coins_cost || redeeming === r.id) && styles.buttonDisabled,
                  pressed && styles.buttonPressed,
                ]}
              >
                {redeeming === r.id ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Schimbă</Text>
                )}
              </Pressable>
            </View>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingBottom: 110,
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
  coins: {
    marginTop: spacing.sm,
    fontSize: typography.size.md,
    color: colors.dark.muted,
  },
  empty: {
    marginTop: spacing.xl,
    fontSize: typography.size.md,
    color: colors.dark.muted,
  },
  list: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  cardContent: {
    marginBottom: spacing.md,
  },
  name: {
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.dark.text,
  },
  desc: {
    marginTop: spacing.xs,
    fontSize: typography.size.sm,
    color: colors.dark.muted,
  },
  partner: {
    marginTop: spacing.sm,
    fontSize: typography.size.sm,
    color: colors.dark.text,
  },
  location: {
    fontSize: typography.size.xs,
    color: colors.dark.muted,
  },
  cost: {
    marginTop: spacing.sm,
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.dark.primary,
  },
  button: {
    backgroundColor: colors.dark.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
