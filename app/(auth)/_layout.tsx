import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="prezentare" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="select-exam" />
      <Stack.Screen name="select-level" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
