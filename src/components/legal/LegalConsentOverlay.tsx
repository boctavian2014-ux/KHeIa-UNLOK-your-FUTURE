import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { colors, spacing, typography } from '@/theme';
import { getGlassSurface, getGlassBlur } from '@/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type LegalConsentOverlayProps = {
  onAccept: () => void;
};

export function LegalConsentOverlay({ onAccept }: LegalConsentOverlayProps) {
  const insets = useSafeAreaInsets();
  const slideY = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;

  useEffect(() => {
    // Scurtă întârziere ca overlay-ul să fie montat în Expo Go, apoi slide-ul e vizibil
    const t = setTimeout(() => {
      Animated.spring(slideY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 100,
        mass: 0.9,
      }).start();
    }, 120);
    return () => clearTimeout(t);
  }, [slideY]);

  return (
    <View
      style={[styles.backdrop, styles.backdropVisible, { paddingTop: insets.top + spacing.md }]}
      pointerEvents="auto"
    >
      <Animated.View
        style={[styles.slideWrapper, { transform: [{ translateY: slideY }] }]}
      >
        <BlurView
          intensity={getGlassBlur('tabBar')}
          tint="dark"
          style={[styles.glass, getGlassSurface(true, 'tabBar')]}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xl }]}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.legalHeading}>POLITICA DE CONFIDENȚIALITATE</Text>
            <Text style={styles.legalHeading}>TERMENI ȘI CONDIȚII</Text>
            <Text style={styles.title}>Bine ai venit în KHEYA</Text>
            <Text style={styles.subtitle}>
              Pentru a folosi aplicația, te rugăm să accepți Termenii și Condițiile și Politica de
              Confidențialitate. Conturile sunt create de părinte sau tutore legal; prin accept,
              confirmi că ești de acord cu prelucrarea datelor conform politicii noastre.
            </Text>
            <Text style={styles.bullets}>
              • Prelucrăm date pentru cont, progres și securitate.{'\n'}
              • Nu vindem date către terți.{'\n'}
              • Poți cere ștergerea datelor oricând.{'\n'}
              • Contact: contact@kheya.ro
            </Text>
            <Pressable
              onPress={onAccept}
              style={({ pressed }) => [styles.acceptButton, pressed && styles.acceptButtonPressed]}
              accessibilityRole="button"
              accessibilityLabel="Accept Termeni și Condiții"
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </Pressable>
          </ScrollView>
        </BlurView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingBottom: 0,
  },
  backdropVisible: {
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  slideWrapper: {
    flex: 1,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  glass: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    padding: spacing.lg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  legalHeading: {
    fontSize: typography.size.sm,
    fontWeight: '700',
    color: colors.dark.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.dark.text,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.dark.muted,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  bullets: {
    fontSize: typography.size.sm,
    color: colors.dark.muted,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  acceptButton: {
    backgroundColor: colors.dark.primary,
    paddingVertical: spacing.md,
    borderRadius: 14,
    alignItems: 'center',
  },
  acceptButtonPressed: {
    opacity: 0.9,
  },
  acceptButtonText: {
    fontSize: typography.size.md,
    fontWeight: '700',
    color: '#fff',
  },
});
