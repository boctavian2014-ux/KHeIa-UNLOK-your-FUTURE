import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

type SubjectCardProps = {
  title: string;
};

export const SubjectCard = ({ title }: SubjectCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    padding: spacing.md,
  },
  text: {
    color: colors.light.text,
    fontWeight: '600',
  },
});
