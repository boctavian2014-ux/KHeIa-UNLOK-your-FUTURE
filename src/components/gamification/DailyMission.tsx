import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

type DailyMissionProps = {
  text: string;
};

export const DailyMission = ({ text }: DailyMissionProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{text}</Text>
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
  },
});
