import { Stack } from 'expo-router';
import { AppBackground } from '@/components/common/AppBackground';
import { CatalogProvider } from '@/components/common/CatalogProvider';
import { StreakUpdater } from '@/components/common/StreakUpdater';
import { SkinProvider } from '@/contexts/SkinContext';

export default function RootLayout() {
  return (
    <SkinProvider>
    <AppBackground>
      <StreakUpdater />
      <CatalogProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          headerTitle: '',
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="subject/[subjectId]" />
        <Stack.Screen name="subject/[subjectId]/generate-chapter" />
        <Stack.Screen name="subject/generate-chapters" />
        <Stack.Screen
          name="generator"
          options={{ headerShown: false, headerTitle: '' }}
        />
        <Stack.Screen
          name="select-chapter"
          options={{ headerShown: false, headerTitle: '' }}
        />
        <Stack.Screen
          name="chapter/[chapterId]/index"
          options={{ headerShown: false, headerTitle: '' }}
        />
        <Stack.Screen
          name="chapter/[chapterId]/theory"
          options={{ headerShown: false, headerTitle: '' }}
        />
        <Stack.Screen
          name="chapter/[chapterId]/generate-theory"
          options={{ headerShown: false, headerTitle: '' }}
        />
        <Stack.Screen
          name="chapter/[chapterId]/quiz"
          options={{ headerShown: false, headerTitle: '' }}
        />
        <Stack.Screen
          name="chapter/[chapterId]/quiz-result"
          options={{ headerShown: false, headerTitle: '' }}
        />
        <Stack.Screen name="test/[testId]" />
        <Stack.Screen name="test/result/[testId]" />
        <Stack.Screen name="rewards" options={{ headerShown: false, headerTitle: '' }} />
        <Stack.Screen name="referral" options={{ headerShown: false, headerTitle: '' }} />
        <Stack.Screen name="subscription" options={{ headerShown: false, headerTitle: '' }} />
        <Stack.Screen name="subscription-success" options={{ headerShown: false, headerTitle: '' }} />
      </Stack>
      </CatalogProvider>
    </AppBackground>
    </SkinProvider>
  );
}
