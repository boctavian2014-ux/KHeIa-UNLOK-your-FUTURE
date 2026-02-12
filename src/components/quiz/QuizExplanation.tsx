import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

type QuizExplanationProps = {
  text: string;
};

export const QuizExplanation = ({ text }: QuizExplanationProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
  },
  text: {
    color: colors.light.muted,
  },
});
