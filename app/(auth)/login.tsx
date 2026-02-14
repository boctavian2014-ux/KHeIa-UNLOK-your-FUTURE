import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { signInWithEmail, signUpWithEmail, resetPassword } from '@/services/auth.service';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Eroare', 'Completează email și parolă.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        Alert.alert('Eroare', error.message ?? 'Autentificare eșuată.');
        return;
      }
      router.replace('/(tabs)/home');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Eroare', 'Completează email și parolă.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Eroare', 'Parola trebuie să aibă minim 6 caractere.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await signUpWithEmail(email, password);
      if (error) {
        Alert.alert('Eroare', error.message ?? 'Înregistrare eșuată.');
        return;
      }
      Alert.alert(
        'Verifică email-ul',
        'Am trimis un link de confirmare. Verifică inbox-ul și apasă linkul.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/home') }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email.trim()) {
      Alert.alert('Eroare', 'Introdu email-ul pentru resetare parolă.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        Alert.alert('Eroare', error.message ?? 'Trimitere eșuată.');
        return;
      }
      Alert.alert('Email trimis', 'Verifică inbox-ul pentru linkul de resetare parolă.');
      setMode('signin');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (mode === 'signin') handleSignIn();
    else if (mode === 'signup') handleSignUp();
    else handleForgot();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Autentificare</Text>
        <Text style={styles.subtitle}>
          {mode === 'signin' && 'Conectează-te pentru a salva progresul'}
          {mode === 'signup' && 'Creează cont pentru a salva progresul'}
          {mode === 'forgot' && 'Resetează parola'}
        </Text>

        <GlassCard dark intensity={14} style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="exemplu@email.com"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
          {mode !== 'forgot' && (
            <>
              <Text style={[styles.label, { marginTop: spacing.md }]}>Parolă</Text>
              <TextInput
                style={styles.input}
                placeholder="Minim 6 caractere"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </>
          )}
          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          >
            <Text style={styles.submitBtnText}>
              {loading
                ? 'Se procesează...'
                : mode === 'signin'
                  ? 'Conectare'
                  : mode === 'signup'
                    ? 'Înregistrare'
                    : 'Trimite link'}
            </Text>
          </Pressable>
        </GlassCard>

        <View style={styles.links}>
          {mode === 'signin' && (
            <>
              <Pressable onPress={() => setMode('signup')} disabled={loading}>
                <Text style={styles.link}>Nu ai cont? Înregistrează-te</Text>
              </Pressable>
              <Pressable onPress={() => setMode('forgot')} disabled={loading}>
                <Text style={styles.link}>Ai uitat parola?</Text>
              </Pressable>
            </>
          )}
          {(mode === 'signup' || mode === 'forgot') && (
            <Pressable onPress={() => setMode('signin')} disabled={loading}>
              <Text style={styles.link}>Înapoi la conectare</Text>
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={() => router.replace('/(tabs)/home')}
          style={styles.skipBtn}
          disabled={loading}
        >
          <Text style={styles.skipText}>Continuă fără cont</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: '700',
    color: colors.dark.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: typography.size.md,
    color: colors.dark.muted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  card: {
    padding: spacing.lg,
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: spacing.sm,
  },
  input: {
    fontSize: typography.size.md,
    color: colors.dark.text,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  submitBtn: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: {
    fontSize: typography.size.md,
    fontWeight: '700',
    color: '#fff',
  },
  links: {
    marginTop: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  link: {
    fontSize: typography.size.sm,
    color: colors.dark.secondary,
    fontWeight: '600',
  },
  skipBtn: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  skipText: {
    fontSize: typography.size.sm,
    color: colors.dark.muted,
  },
});
