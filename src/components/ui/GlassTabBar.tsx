import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { getGlassBlur, getGlassSurface, glassStyles } from '@/theme';

type GlassTabBarProps = {
  children: ReactNode;
  dark?: boolean;
  intensity?: number;
};

export const GlassTabBar = ({ children, dark = false, intensity }: GlassTabBarProps) => {
  const resolvedIntensity = intensity ?? getGlassBlur('tabBar');
  return (
    <BlurView
      intensity={resolvedIntensity}
      tint={dark ? 'dark' : 'light'}
      style={[glassStyles.tabBar, styles.container, getGlassSurface(dark, 'tabBar')]}
    >
      <View style={styles.content}>{children}</View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
