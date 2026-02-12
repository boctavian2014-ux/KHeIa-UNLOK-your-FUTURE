import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

type ChapterCardProps = {
  title: string;
  status?: string;
};

export const ChapterCard = ({ title, status }: ChapterCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    padding: spacing.md,
  },
  title: {
    color: colors.light.text,
    fontWeight: '600',
  },
  status: {
    color: colors.light.muted,
    marginTop: spacing.xs,
  },
});
