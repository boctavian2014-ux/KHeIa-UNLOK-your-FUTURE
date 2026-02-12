import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

type BadgeDisplayProps = {
  label: string;
};

export const BadgeDisplay = ({ label }: BadgeDisplayProps) => {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: spacing.sm,
  },
  text: {
    color: colors.light.text,
  },
});
