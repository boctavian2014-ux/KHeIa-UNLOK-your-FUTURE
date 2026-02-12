import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '@/theme';

type PillButtonProps = {
  label: string;
  onPress: () => void;
};

export const PillButton = ({ label, onPress }: PillButtonProps) => {
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
  },
  text: {
    color: colors.light.text,
    fontWeight: '600',
  },
});
