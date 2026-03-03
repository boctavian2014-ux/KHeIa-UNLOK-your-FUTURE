import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { getOnboardingDone } from '@/lib/onboardingStorage';
import { getLegalConsentAccepted, setLegalConsentAccepted } from '@/lib/legalConsentStorage';
import { LegalConsentOverlay } from '@/components/legal/LegalConsentOverlay';
import { colors, typography } from '@/theme';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [legalAccepted, setLegalAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const [done, legal] = await Promise.all([getOnboardingDone(), getLegalConsentAccepted()]);
      setOnboardingDone(done);
      setLegalAccepted(legal);
      setReady(true);
    })();
  }, []);

  const handleLegalAccept = async () => {
    await setLegalConsentAccepted();
    setLegalAccepted(true);
  };

  if (!ready) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTitle}>KHEYA – Unlock Your Future</Text>
        <ActivityIndicator size="small" color={colors.dark.primary} style={styles.spinner} />
      </View>
    );
  }

  if (legalAccepted === false) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTitle}>KHEYA – Unlock Your Future</Text>
        <LegalConsentOverlay onAccept={handleLegalAccept} />
      </View>
    );
  }

  if (!onboardingDone) {
    return <Redirect href="/prezentare" />;
  }

  return <Redirect href="/(tabs)/home" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loadingTitle: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.dark.text,
    marginBottom: 16,
  },
  spinner: {
    marginTop: 8,
  },
});
