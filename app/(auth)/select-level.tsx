import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { setOnboardingLevel, setOnboardingDone, type LevelType } from '@/lib/onboardingStorage';

const LEVELS: { key: LevelType; title: string; desc: string }[] = [
  { key: 'gimnaziu', title: 'Gimnaziu', desc: 'Clasele 5–8' },
  { key: 'liceu', title: 'Liceu', desc: 'Clasele 9–12' },
];

export default function SelectLevelScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSelect = async (level: LevelType) => {
    await setOnboardingLevel(level);
    await setOnboardingDone();
    router.replace('/(tabs)/home');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
      <Text style={styles.title}>Selectează nivelul</Text>
      <Text style={styles.subtitle}>Alege nivelul școlar pentru materiale relevante</Text>

      <View style={styles.grid}>
        {LEVELS.map((level) => (
          <Pressable
            key={level.key}
            onPress={() => handleSelect(level.key)}
            style={({ pressed }) => [styles.cardWrap, pressed && styles.cardPressed]}
          >
            <GlassCard dark intensity={14} style={styles.card}>
              <Text style={styles.cardTitle}>{level.title}</Text>
              <Text style={styles.cardDesc}>{level.desc}</Text>
            </GlassCard>
          </Pressable>
        ))}
      </View>
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
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: typography.size.md,
    color: colors.dark.muted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  grid: {
    gap: spacing.lg,
  },
  cardWrap: { marginBottom: spacing.sm },
  cardPressed: { opacity: 0.9 },
  card: {
    padding: spacing.xl,
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  cardTitle: {
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.dark.text,
  },
  cardDesc: {
    marginTop: spacing.tight,
    fontSize: typography.size.sm,
    color: colors.dark.muted,
  },
});
