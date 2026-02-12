import { Tabs } from 'expo-router';
import { useColorScheme, StyleSheet, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getGlassBlur, getGlassSurface } from '@/theme';

const tabIcon = (name: keyof typeof Ionicons.glyphMap) =>
  ({ color }: { color: string }) =>
    <Ionicons name={name} size={22} color={color} />;

export default function TabsLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const tabSurface = getGlassSurface(isDark, 'tabBar');
  const tabBlur = getGlassBlur('tabBar');
  const tabBackground = { backgroundColor: tabSurface.backgroundColor };
  const logoImg = require('../../assets/logo.jpeg');
  const logoTabIcon = () => (
    <Image source={logoImg} style={styles.logoIcon} resizeMode="contain" />
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => (
          <BlurView
            intensity={tabBlur}
            tint={isDark ? 'dark' : 'light'}
            style={[StyleSheet.absoluteFill, tabBackground]}
          />
        ),
        tabBarStyle: {
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: 16,
          borderRadius: 999,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: tabSurface.borderColor,
          shadowColor: tabSurface.shadowColor,
          shadowOpacity: tabSurface.shadowOpacity,
          shadowRadius: tabSurface.shadowRadius,
          shadowOffset: tabSurface.shadowOffset,
          elevation: tabSurface.elevation,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarActiveTintColor: isDark ? '#F9FAFB' : '#111827',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarItemStyle: {
          borderRadius: 999,
          marginHorizontal: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarActiveBackgroundColor: 'rgba(248, 250, 252, 0.12)',
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: 'Acasa', tabBarIcon: tabIcon('home') }}
      />
      <Tabs.Screen
        name="kheia"
        options={{ title: 'KhEIa', tabBarIcon: logoTabIcon }}
      />
      <Tabs.Screen
        name="tests"
        options={{ title: 'Teste', tabBarIcon: tabIcon('document-text') }}
      />
      <Tabs.Screen
        name="progress"
        options={{ title: 'Progres', tabBarIcon: tabIcon('stats-chart') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profil', tabBarIcon: tabIcon('person') }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logoIcon: {
    width: 20,
    height: 20,
  },
});
