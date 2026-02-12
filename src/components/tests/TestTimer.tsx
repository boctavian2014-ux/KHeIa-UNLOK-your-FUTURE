import { StyleSheet, Text } from 'react-native';
import { colors } from '@/theme';
import { formatDuration } from '@/utils/formatters';

type TestTimerProps = {
  secondsLeft: number;
};

export const TestTimer = ({ secondsLeft }: TestTimerProps) => {
  return <Text style={styles.text}>{formatDuration(secondsLeft)}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: colors.light.text,
    fontWeight: '600',
  },
});
