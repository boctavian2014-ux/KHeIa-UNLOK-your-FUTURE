import { Tabs } from 'expo-router';
import { useColorScheme, StyleSheet, View } from 'react-native';
import { TabBarIcon } from '@/components/TabBarIcon';
import { spacing } from '@/theme';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                borderRadius: 999,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.12)',
              },
            ]}
          />
        ),
        tabBarStyle: {
          position: 'absolute',
          left: spacing.screenPadding,
          right: spacing.screenPadding,
          bottom: spacing.relaxed,
          borderRadius: 999,
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderColor: 'transparent',
          shadowColor: 'transparent',
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
          paddingBottom: spacing.compact,
          paddingTop: spacing.compact,
          height: 64,
        },
        tabBarActiveTintColor: isDark ? '#F9FAFB' : '#111827',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarItemStyle: {
          borderRadius: 999,
          marginHorizontal: spacing.tight,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarActiveBackgroundColor: 'transparent',
        tabBarIconStyle: {
          marginBottom: -spacing.tight,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Acasa',
          tabBarIcon: ({ color, focused, size }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              size={size}
              activeName="book"
              inactiveName="book-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="kheia"
        options={{
          title: 'KhEIa',
          tabBarIcon: ({ color, focused, size }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              size={size}
              activeName="chatbubble-ellipses"
              inactiveName="chatbubble-ellipses-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tests"
        options={{
          title: 'Teste',
          tabBarIcon: ({ color, focused, size }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              size={size}
              activeName="clipboard"
              inactiveName="clipboard-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progres',
          tabBarIcon: ({ color, focused, size }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              size={size}
              activeName="bar-chart"
              inactiveName="bar-chart-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused, size }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              size={size}
              activeName="person-circle"
              inactiveName="person-circle-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}
