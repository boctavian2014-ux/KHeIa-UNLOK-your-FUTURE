import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';

const kheiaIcon = require('../../assets/KHEIA ICON.png');

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    router.push('/select-exam');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
      <View style={styles.content}>
        <Image source={kheiaIcon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.title}>KhEIa</Text>
        <Text style={styles.tagline}>Unlock Your Future</Text>
        <Text style={styles.subtitle}>
          Antrenorul tău personal pentru Evaluare Națională și Bacalaureat. Alege tipul de examen și
          nivelul pentru a începe.
        </Text>
        <GlassCard dark intensity={14} style={styles.card}>
          <Text style={styles.cardText}>
            În următorii pași vei selecta examenul (EN sau Bac) și nivelul (gimnaziu sau liceu).
            Poți schimba aceste setări oricând din aplicație.
          </Text>
        </GlassCard>
      </View>
      <Pressable onPress={handleNext} style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}>
        <Text style={styles.btnText}>Începe</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  content: { alignItems: 'center' },
  icon: { width: 80, height: 80, marginBottom: spacing.lg },
  title: {
    fontSize: typography.size.xxl,
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
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  card: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  cardText: {
    fontSize: typography.size.sm,
    color: colors.dark.muted,
    lineHeight: 20,
    textAlign: 'center',
  },
  btn: {
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
