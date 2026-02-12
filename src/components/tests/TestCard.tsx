import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

type TestCardProps = {
  title: string;
  score?: number;
};

export const TestCard = ({ title, score }: TestCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {score !== undefined ? <Text style={styles.score}>{`Scor: ${score}`}</Text> : null}
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
