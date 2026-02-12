import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';

export default function GenerateQuizScreen() {
  const router = useRouter();

  const options = [
    {
      id: 'chapter',
      title: 'Quiz capitol',
      desc: 'Întrebări din capitolul ales. Rezultatul în capitol.',
      onPress: () => router.push({ pathname: '/select-chapter', params: { for: 'quiz' } }),
    },
    {
      id: 'en',
      title: 'Test Evaluare Națională',
      desc: 'Simulare EN conform programei și formei de examen.',
      onPress: () => router.replace('/(tabs)/tests'),
    },
    {
      id: 'bac',
      title: 'Test Bacalaureat',
      desc: 'Simulare BAC conform programei și formei de examen.',
      onPress: () => router.replace('/(tabs)/tests'),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={16}>
        <Text style={styles.backText}>← Înapoi</Text>
      </Pressable>

      <Text style={styles.title}>Generează quiz / teste</Text>
      <Text style={styles.subtitle}>
        Quiz-urile pentru capitole și testele EN/BAC vor apărea în ecranul Teste.
      </Text>

      <View style={styles.list}>
        {options.map((opt) => (
          <Pressable
            key={opt.id}
            onPress={opt.onPress}
            style={({ pressed }) => [pressed && styles.cardPressed]}
          >
            <GlassCard dark intensity={16} style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{opt.title}</Text>
                <Text style={styles.cardDesc}>{opt.desc}</Text>
              </View>
              <Text style={styles.cardArrow}>→</Text>
            </GlassCard>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: spacing.lg, paddingBottom: 120 },
  backRow: { marginBottom: spacing.md },
  backText: { fontSize: typography.size.md, fontWeight: '600', color: colors.dark.secondary },
  title: { fontSize: typography.size.xl, fontWeight: '700', color: '#ffffff', marginBottom: spacing.xs },
  subtitle: { fontSize: typography.size.sm, color: 'rgba(255,255,255,0.8)', marginBottom: spacing.lg },
  list: { gap: spacing.sm },
  cardPressed: { opacity: 0.9 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(2, 6, 23, 0.78)',
    borderColor: 'rgba(148, 163, 184, 0.3)',
    borderWidth: 1,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: typography.size.md, fontWeight: '700', color: '#ffffff' },
  cardDesc: { marginTop: 2, fontSize: typography.size.xs, color: 'rgba(255,255,255,0.75)' },
  cardArrow: { fontSize: typography.size.lg, color: 'rgba(255,255,255,0.7)', marginLeft: spacing.sm },
});
