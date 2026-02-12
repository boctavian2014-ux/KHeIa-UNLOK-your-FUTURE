import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

export const OfflineBanner = () => {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>Mod offline</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: spacing.sm,
  },
  text: {
    color: colors.light.text,
    fontWeight: '600',
  },
});
