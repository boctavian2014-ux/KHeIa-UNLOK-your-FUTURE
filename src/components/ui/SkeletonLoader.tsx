import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';

type SkeletonLoaderProps = {
  height?: number;
};

export const SkeletonLoader = ({ height = 16 }: SkeletonLoaderProps) => {
  return <View style={[styles.skeleton, { height }]} />;
};

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 8,
    backgroundColor: colors.light.border,
    opacity: 0.7,
  },
});
