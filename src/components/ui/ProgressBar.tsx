import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';

type ProgressBarProps = {
  progress: number;
};

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.min(100, progress * 100)}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.dark.primary,
  },
});
