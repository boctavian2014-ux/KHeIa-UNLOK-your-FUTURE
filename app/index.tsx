import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { getOnboardingDone } from '@/lib/onboardingStorage';
import { colors } from '@/theme';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    getOnboardingDone().then((done) => {
      setOnboardingDone(done);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
        <ActivityIndicator size="large" color={colors.dark.primary} />
      </View>
    );
  }

  if (!onboardingDone) {
    return <Redirect href="/prezentare" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
