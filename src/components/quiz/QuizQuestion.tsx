import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

type QuizQuestionProps = {
  question: string;
};

export const QuizQuestion = ({ question }: QuizQuestionProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{question}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  text: {
    color: colors.light.text,
    fontSize: 18,
    fontWeight: '600',
  },
});
