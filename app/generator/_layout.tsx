import { Stack } from 'expo-router';

export default function GeneratorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="generate-quiz" />
    </Stack>
  );
}
