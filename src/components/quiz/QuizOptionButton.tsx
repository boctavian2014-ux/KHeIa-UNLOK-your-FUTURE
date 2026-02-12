import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '@/theme';

type QuizOptionButtonProps = {
  label: string;
  onPress: () => void;
};

export const QuizOptionButton = ({ label, onPress }: QuizOptionButtonProps) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.light.surface,
    borderRadius: 20,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  text: {
    color: colors.light.text,
  },
});
