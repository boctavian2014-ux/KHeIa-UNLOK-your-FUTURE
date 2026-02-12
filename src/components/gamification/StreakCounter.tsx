import { StyleSheet, Text } from 'react-native';
import { colors } from '@/theme';

type StreakCounterProps = {
  streak: number;
};

export const StreakCounter = ({ streak }: StreakCounterProps) => {
  return <Text style={styles.text}>{`Streak: ${streak}`}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: colors.light.text,
    fontWeight: '600',
  },
});
