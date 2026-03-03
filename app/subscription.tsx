import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { SUBSCRIPTION_PRICES_RON } from '@/services/subscription.service';
import { getQuizQuestionLimit } from '@/services/subscription.service';
import { updateSubscriptionAfterPurchase } from '@/services/subscription.service';
import {
  isRevenueCatConfigured,
  initPurchases,
  purchasePackage,
  PLAN_TO_PACKAGE_ID,
} from '@/services/purchases.service';
import { supabase } from '@/services/supabase';

type PlanId = 'monthly' | 'yearly';

const PLANS: Array<{
  id: PlanId;
  title: string;
  price: number;
  priceLabel: string; // ex. "19 RON/lună"
  billingNote: string; // ex. "Facturare lunară"
  highlight?: boolean;
}> = [
  {
    id: 'monthly',
    title: 'Lunar',
    price: SUBSCRIPTION_PRICES_RON.monthly,
    priceLabel: `${SUBSCRIPTION_PRICES_RON.monthly} RON/lună`,
    billingNote: 'Facturare lunară',
    highlight: false,
  },
  {
    id: 'yearly',
    title: 'Anual',
    price: SUBSCRIPTION_PRICES_RON.yearly,
    priceLabel: `${SUBSCRIPTION_PRICES_RON.yearly} RON/an`,
    billingNote: 'Facturare anuală',
    highlight: true,
  },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const { source, discount24h } = useLocalSearchParams<{ source?: string; discount24h?: string }>();
  const [purchasing, setPurchasing] = useState<PlanId | null>(null);

  const showDiscount = discount24h === 'true';

  useEffect(() => {
    if (!isRevenueCatConfigured()) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      await initPurchases(user?.id ?? null);
    })();
  }, []);

  const handlePurchase = async (planId: PlanId) => {
    setPurchasing(planId);
    try {
      if (isRevenueCatConfigured()) {
        const packageId = PLAN_TO_PACKAGE_ID[planId] ?? planId;
        const result = await purchasePackage(packageId);
        if (!result.success) {
          const msg = result.error instanceof Error ? result.error.message : 'Plata a eșuat.';
          if (msg.toLowerCase().includes('cancelled') || msg.toLowerCase().includes('canceled')) {
            setPurchasing(null);
            return;
          }
          Alert.alert('Eroare', msg);
          setPurchasing(null);
          return;
        }
        const expirationDate = result.customerInfo.expirationDate;
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id && expirationDate) {
          await updateSubscriptionAfterPurchase(user.id, planId, expirationDate);
        }
        router.replace({
          pathname: '/subscription-success',
          params: { plan: planId, ...(expirationDate && { expiration: expirationDate }) },
        });
      } else {
        await new Promise((r) => setTimeout(r, 1500));
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) {
          Alert.alert(
            'Cont necesar',
            'Trebuie să fii autentificat pentru a salva abonamentul. Autentifică-te și încearcă din nou.',
            [{ text: 'OK' }]
          );
          setPurchasing(null);
          return;
        }
        const now = new Date();
        const expirationDate =
          planId === 'yearly'
            ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString()
            : (() => {
                const y = now.getFullYear();
                const m = now.getMonth() + 1;
                const lastDayNext = new Date(y, m + 1, 0).getDate();
                const day = Math.min(now.getDate(), lastDayNext);
                return new Date(y, m, day).toISOString();
              })();
        await updateSubscriptionAfterPurchase(user.id, planId, expirationDate);
        router.replace({
          pathname: '/subscription-success',
          params: { plan: planId, expiration: expirationDate },
        });
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Eroare', 'A apărut o problemă. Încearcă din nou.');
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
      <Pressable
        onPress={() => router.back()}
        style={styles.back}
        accessibilityRole="button"
        accessibilityLabel="Înapoi"
      >
        <Text style={styles.backText}>← Înapoi</Text>
      </Pressable>

      <Text style={styles.title}>KhEIa Premium</Text>
      <Text style={styles.subtitle}>
        Deblochează {getQuizQuestionLimit(true)} întrebări per quiz, toate capitolele și simulări complete.
      </Text>

      {source === 'chapter_lock' && (
        <Text style={styles.sourceMessage}>Acest capitol necesită Premium.</Text>
      )}
      {source === 'quiz_lock' && (
        <Text style={styles.sourceMessage}>Quiz-ul acestui capitol necesită Premium.</Text>
      )}
      {source === 'test_limit' && (
        <Text style={styles.sourceMessage}>Ai folosit testul gratuit. Pentru mai multe teste, abonează-te.</Text>
      )}

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
            accessibilityRole="button"
            accessibilityLabel={`Plan ${plan.title}, ${plan.priceLabel}, ${plan.billingNote}. Alege acest plan.`}
          >
            <GlassCard dark intensity={18} style={styles.planCardInner}>
              {plan.highlight && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Recomandat</Text>
                </View>
              )}
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={styles.planPrice}>{plan.priceLabel}</Text>
              <Text style={styles.planBillingNote}>{plan.billingNote}</Text>
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
  sourceMessage: {
    fontSize: typography.size.sm,
    color: colors.dark.primary,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
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
  planBillingNote: { fontSize: typography.size.sm, color: colors.dark.muted, marginTop: spacing.xs },
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