import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

type PillToggleProps = {
  leftLabel: string;
  rightLabel: string;
  value: 'left' | 'right';
  onChange: (value: 'left' | 'right') => void;
};

export const PillToggle = ({ leftLabel, rightLabel, value, onChange }: PillToggleProps) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, value === 'left' && styles.active]}
        onPress={() => onChange('left')}
      >
        <Text style={styles.label}>{leftLabel}</Text>
      </Pressable>
      <Pressable
        style={[styles.button, value === 'right' && styles.active]}
        onPress={() => onChange('right')}
      >
        <Text style={styles.label}>{rightLabel}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.light.surface,
    borderRadius: 20,
    padding: spacing.xs,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 16,
  },
  active: {
    backgroundColor: colors.light.primary,
  },
  label: {
    color: colors.light.text,
    fontWeight: '600',
  },
});
