import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

type QuizResultCardProps = {
  score: number;
  total: number;
};

export const QuizResultCard = ({ score, total }: QuizResultCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{`Scor: ${score}/${total}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    padding: spacing.md,
  },
  text: {
    color: colors.light.text,
    fontWeight: '600',
  },
});
