import { StyleSheet, Text } from 'react-native';
import { colors } from '@/theme';

type QuizProgressIndicatorProps = {
  current: number;
  total: number;
};

export const QuizProgressIndicator = ({ current, total }: QuizProgressIndicatorProps) => {
  return <Text style={styles.text}>{`Întrebarea ${current}/${total}`}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: colors.light.muted,
  },
});
