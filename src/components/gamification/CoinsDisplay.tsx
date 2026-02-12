import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';

type CoinsDisplayProps = {
  coins: number;
};

export const CoinsDisplay = ({ coins }: CoinsDisplayProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🪙</Text>
      <Text style={styles.text}>Ai {coins} monede</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  text: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.dark.text,
  },
});
