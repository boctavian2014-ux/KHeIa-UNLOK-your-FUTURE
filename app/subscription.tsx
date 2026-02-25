import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { SUBSCRIPTION_PRICES_RON } from '@/services/subscription.service';
import { getQuizQuestionLimit } from '@/services/subscription.service';

type PlanId = 'monthly' | 'yearly' | 'full_edumat';

const PLANS: Array<{
  id: PlanId;
  title: string;
  price: number;
  period: string;
  highlight?: boolean;
}> = [
  { id: 'monthly', title: 'Lunar', price: SUBSCRIPTION_PRICES_RON.monthly, period: '/lună' },
  { id: 'yearly', title: 'Anual', price: SUBSCRIPTION_PRICES_RON.yearly, period: '/an', highlight: true },
  { id: 'full_edumat', title: 'Full Edumat (KhEIa + MEDIX)', price: SUBSCRIPTION_PRICES_RON.full_edumat, period: 'one-time' },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const { source, discount24h } = useLocalSearchParams<{ source?: string; discount24h?: string }>();
  const [purchasing, setPurchasing] = useState<PlanId | null>(null);

  const showDiscount = discount24h === 'true';

  const handlePurchase = async (planId: PlanId) => {
    setPurchasing(planId);
    try {
      // TODO: Integrate RevenueCat
      // const Purchases = await import('react-native-purchases').then(m => m.default);
      // const { customerInfo } = await Purchases.purchasePackage(packages[planId]);
      // await updateSubscriptionAfterPurchase(userId, planType, customerInfo.expirationDate);
      await new Promise((r) => setTimeout(r, 1500));
      router.replace({
        pathname: '/subscription-success',
        params: { plan: planId },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Înapoi</Text>
      </Pressable>

      <Text style={styles.title}>KhEIa Premium</Text>
      <Text style={styles.subtitle}>
        Deblochează {getQuizQuestionLimit(true)} întrebări per quiz, toate capitolele și simulări complete.
      </Text>

      {showDiscount && (
        <GlassCard dark intensity={18} style={styles.discountBanner}>
          <Text style={styles.discountText}>
            Ofertă specială 24h: -20% pentru tine!
          </Text>
        </GlassCard>
      )}

      <View style={styles.plans}>
        {PLANS.map((plan) => (
          <Pressable
            key={plan.id}
            onPress={() => handlePurchase(plan.id)}
            disabled={!!purchasing}
            style={({ pressed }) => [
              styles.planCard,
              plan.highlight && styles.planCardHighlight,
              pressed && styles.planCardPressed,
            ]}
          >
            <GlassCard dark intensity={18} style={styles.planCardInner}>
              {plan.highlight && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Recomandat</Text>
                </View>
              )}
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={styles.planPrice}>
                {plan.price} RON
                <Text style={styles.planPeriod}> {plan.period}</Text>
              </Text>
              <View style={styles.planButton}>
                {purchasing === plan.id ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.planButtonText}>Alege</Text>
                )}
              </View>
            </GlassCard>
          </Pressable>
        ))}
      </View>

      <Text style={styles.footer}>
        Anulare oricând. Acces instant după plată.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: spacing.lg, paddingBottom: spacing.contentBottom },
  back: { marginBottom: spacing.md },
  backText: { fontSize: typography.size.md, fontWeight: '600', color: colors.dark.secondary },
  title: { fontSize: typography.size.xl, fontWeight: '700', color: colors.dark.text },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: typography.size.md,
    color: colors.dark.muted,
    marginBottom: spacing.lg,
  },
  discountBanner: {
    padding: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: 'rgba(34, 197, 94, 0.5)',
  },
  discountText: { fontSize: typography.size.md, fontWeight: '700', color: '#22C55E', textAlign: 'center' },
  plans: { gap: spacing.md },
  planCard: { marginBottom: spacing.sm },
  planCardHighlight: { borderWidth: 2, borderColor: colors.dark.primary, borderRadius: 16 },
  planCardPressed: { opacity: 0.9 },
  planCardInner: {
    padding: spacing.lg,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: spacing.md,
    backgroundColor: colors.dark.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  planTitle: { fontSize: typography.size.lg, fontWeight: '700', color: colors.dark.text },
  planPrice: { fontSize: typography.size.xl, fontWeight: '700', color: colors.dark.primary, marginTop: spacing.sm },
  planPeriod: { fontSize: typography.size.sm, fontWeight: '400', color: colors.dark.muted },
  planButton: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.dark.primary,
    borderRadius: 12,
    alignItems: 'center',
  },
  planButtonText: { fontSize: typography.size.md, fontWeight: '700', color: '#fff' },
  footer: {
    marginTop: spacing.xl,
    fontSize: typography.size.sm,
    color: colors.dark.muted,
    textAlign: 'center',
  },
});
