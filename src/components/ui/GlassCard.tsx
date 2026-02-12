import { ReactNode } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { getGlassBlur, getGlassSurface, glassStyles } from '@/theme';

type GlassCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  dark?: boolean;
};

export const GlassCard = ({ children, style, intensity, dark = false }: GlassCardProps) => {
  const resolvedIntensity = intensity ?? getGlassBlur('card');
  return (
    <BlurView
      intensity={resolvedIntensity}
      tint={dark ? 'dark' : 'light'}
      style={[glassStyles.card, styles.clip, getGlassSurface(dark, 'card'), style]}
    >
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
});
