import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export default function SelectLevelScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selectează nivelul</Text>
      <Text style={styles.subtitle}>Gimnaziu sau Liceu</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.dark.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.md,
    fontSize: typography.size.md,
    color: colors.dark.muted,
    textAlign: 'center',
  },
});
