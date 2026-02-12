import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

type BadgeChipProps = {
  label: string;
};

export const BadgeChip = ({ label }: BadgeChipProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.surface,
    borderRadius: 14,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  text: {
    color: colors.light.text,
    fontWeight: '600',
  },
});
