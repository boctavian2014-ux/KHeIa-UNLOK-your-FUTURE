import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function GenerateChaptersScreen() {
  const chapters = [
    {
      id: 1,
      title: 'Numere naturale și operații',
      meta: '10 întrebări · dificultate medie',
      status: 'completed',
      statusLabel: 'Complet',
      badge: 'EN',
    },
    {
      id: 2,
      title: 'Fracții și procente',
      meta: '7/10 întrebări rezolvate',
      status: 'inProgress',
      statusLabel: 'În progres',
      badge: 'EN',
    },
    {
      id: 3,
      title: 'Ecuații de gradul I',
      meta: 'Nu ai început încă',
      status: 'notStarted',
      statusLabel: 'Neînceput',
      badge: 'EN',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Setul tău de 10 capitole</Text>
      <Text style={styles.subtitle}>
        Pregătire pentru Evaluare Națională – Matematică, gimnaziu
      </Text>
      <ProgressBar progress={0.4} />

      <View style={styles.list}>
        {chapters.map((chapter) => {
          const statusStyle = styles[chapter.status as keyof typeof styles];
          return (
          <GlassCard key={chapter.id} dark style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardLeft}>
                <View style={styles.index}>
                  <Text style={styles.indexText}>{chapter.id}</Text>
                </View>
                <View style={styles.info}>
                  <View style={styles.titleRow}>
                    <Text style={styles.cardTitle}>{chapter.title}</Text>
                    <Text style={styles.badge}>{chapter.badge}</Text>
                  </View>
                  <Text style={styles.cardMeta}>{chapter.meta}</Text>
                </View>
              </View>
              <View style={[styles.status, statusStyle]}>
                <Text style={styles.statusText}>{chapter.statusLabel}</Text>
              </View>
            </View>
          </GlassCard>
          );
        })}
      </View>

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Începe lecțiile</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: 100,
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
    marginBottom: spacing.md,
  },
  list: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  card: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
  },
  index: {
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  indexText: {
    fontSize: 12,
    color: '#CBD5F5',
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.text,
  },
  cardMeta: {
    marginTop: 2,
    fontSize: 12,
    color: colors.dark.muted,
  },
  badge: {
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.6)',
    color: '#CBD5F5',
    backgroundColor: 'rgba(248, 250, 252, 0.09)',
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  notStarted: {
    backgroundColor: 'rgba(31, 41, 55, 0.85)',
    borderColor: 'rgba(75, 85, 99, 0.8)',
  },
  inProgress: {
    backgroundColor: 'rgba(59, 130, 246, 0.16)',
    borderColor: 'rgba(59, 130, 246, 0.7)',
  },
  completed: {
    backgroundColor: 'rgba(34, 197, 94, 0.16)',
    borderColor: 'rgba(34, 197, 94, 0.7)',
  },
  primaryButton: {
    marginTop: spacing.lg,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: '#22C55E',
    shadowColor: '#16A34A',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#020617',
  },
});
