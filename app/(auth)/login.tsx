import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Autentificare</Text>
      <Text style={styles.subtitle}>Google / Apple / Test user</Text>
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
