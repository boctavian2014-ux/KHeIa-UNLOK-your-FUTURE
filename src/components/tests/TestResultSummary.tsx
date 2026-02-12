import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

type TestResultSummaryProps = {
  score: number;
  total: number;
};

export const TestResultSummary = ({ score, total }: TestResultSummaryProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Rezultat</Text>
      <Text style={styles.score}>{`${score}/${total}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    padding: spacing.md,
  },
  title: {
    color: colors.light.text,
    fontWeight: '600',
  },
  score: {
    marginTop: spacing.xs,
    color: colors.light.muted,
  },
});
