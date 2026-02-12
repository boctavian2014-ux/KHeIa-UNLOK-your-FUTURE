import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';

type LoadingOverlayProps = {
  label?: string;
};

export const LoadingOverlay = ({ label = 'Se incarca...' }: LoadingOverlayProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.light.text,
    fontWeight: '600',
  },
});
