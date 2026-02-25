import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

type StreakCounterProps = {
  streak: number;
};

export const StreakCounter = ({ streak }: StreakCounterProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{streak > 0 ? '🔥' : '❄️'}</Text>
      <Text style={styles.text}>
        {streak} {streak === 1 ? 'zi' : 'zile'} la rând
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  text: {
    color: colors.dark.text,
    fontWeight: '600',
    fontSize: 14,
  },
});
