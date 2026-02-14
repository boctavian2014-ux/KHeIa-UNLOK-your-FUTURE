import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';

const kheiaIcon = require('../../assets/KHEIA ICON.png');

const FEATURES = [
  { icon: '📚', text: 'Teorie structurată pe capitole pentru EN și Bacalaureat' },
  { icon: '🧩', text: 'Quiz-uri interactive pentru verificarea cunoștințelor' },
  { icon: '📊', text: 'Teste simulate și progres personalizat' },
];

export default function PrezentareScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleStart = () => {
    router.push('/onboarding');
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.xl }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Image source={kheiaIcon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.title}>KhEIa</Text>
        <Text style={styles.tagline}>Unlock Your Future</Text>
        <Text style={styles.subtitle}>
          Antrenorul tău personal pentru Evaluare Națională și Bacalaureat. Pregătește-te eficient,
          învață la propriul ritm și urcă în clasament.
        </Text>

        <GlassCard dark intensity={14} style={styles.featuresCard}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </GlassCard>
      </View>

      <Pressable onPress={handleStart} style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}>
        <Text style={styles.btnText}>Începe</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  content: { alignItems: 'center' },
  icon: { width: 120, height: 120, marginBottom: spacing.lg },
  title: {
    fontSize: typography.size.xxl + 4,
    fontWeight: '700',
    color: colors.dark.text,
    textAlign: 'center',
  },
  tagline: {
    marginTop: spacing.xs,
    fontSize: typography.size.lg,
    color: colors.dark.secondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.lg,
    fontSize: typography.size.md,
    color: colors.dark.muted,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.sm,
  },
  featuresCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
    width: '100%',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureIcon: {
    fontSize: 22,
    marginRight: spacing.md,
  },
  featureText: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.dark.muted,
    lineHeight: 20,
  },
  btn: {
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
  },
  btnPressed: { opacity: 0.9 },
  btnText: {
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: '#fff',
  },
});
