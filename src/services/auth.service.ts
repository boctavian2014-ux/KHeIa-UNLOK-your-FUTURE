import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from './supabase';

/**
 * Redirect URL pentru OAuth. Folosim Linking.createURL ca:
 * - În Expo Go: exp://IP:8081/--/auth/callback (revine în app, nu la localhost)
 * - În build: kheia://auth/callback
 * Adaugă în Supabase → Authentication → URL Configuration → Redirect URLs.
 */
function getOAuthRedirectUrl(): string {
  return Linking.createURL('auth/callback');
}

/**
 * Signs in with email and password.
 */
export const signInWithEmail = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email: email.trim(), password });
};

/**
 * Signs up with email and password.
 */
export const signUpWithEmail = async (email: string, password: string) => {
  return supabase.auth.signUp({ email: email.trim(), password });
};

/**
 * Sends password reset email.
 */
export const resetPassword = async (email: string) => {
  return supabase.auth.resetPasswordForEmail(email.trim());
};

/**
 * Starts Google OAuth flow: opens browser and returns the URL to open.
 * Caller should use WebBrowser.openAuthSessionAsync with this URL and the redirect,
 * then pass the result URL to setSessionFromOAuthRedirectUrl.
 */
export const getGoogleOAuthUrl = async (redirectTo?: string) => {
  const redirect = redirectTo ?? getOAuthRedirectUrl();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirect,
      skipBrowserRedirect: true,
    },
  });
  if (error) return { url: null as string | null, error };
  return { url: data?.url ?? null, error: null };
};

/**
 * Parses the OAuth redirect URL (with hash fragment from Supabase) and sets the session.
 */
export const setSessionFromOAuthRedirectUrl = async (url: string) => {
  const fragment = url.includes('#') ? url.split('#')[1] : '';
  if (!fragment) return { error: new Error('No fragment in redirect URL') };
  const params = new URLSearchParams(fragment);
  const access_token = params.get('access_token');
  const refresh_token = params.get('refresh_token');
  if (!access_token || !refresh_token) {
    return { error: new Error('Missing access_token or refresh_token in URL') };
  }
  return supabase.auth.setSession({ access_token, refresh_token });
};

/**
 * Signs in (or registers) with Google via OAuth in browser.
 * Opens the system browser, then sets the session from the redirect URL.
 * Redirect URL este generat din Linking.createURL ca să funcționeze și în Expo Go (nu localhost).
 */
export const signInWithGoogle = async () => {
  const redirectTo = getOAuthRedirectUrl();
  const { url, error: urlError } = await getGoogleOAuthUrl(redirectTo);
  if (urlError || !url) {
    return { error: urlError ?? new Error('No OAuth URL returned') };
  }
  const result = await WebBrowser.openAuthSessionAsync(url, redirectTo);
  if (result.type !== 'success' || !result.url) {
    return { error: new Error(result.type === 'cancel' ? 'Anulare' : 'Autentificare eșuată') };
  }
  const { error: sessionError } = await setSessionFromOAuthRedirectUrl(result.url);
  if (sessionError) return { error: sessionError };
  return { error: null };
};

/**
 * Signs in with a test user for development.
 */
export const signInTestUser = async () => {
  const email = 'test-user@kheya.local';
  const password = 'test-user-password';
  return supabase.auth.signInWithPassword({ email, password });
};

/**
 * Signs out the current user.
 */
export const signOut = async () => {
  return supabase.auth.signOut();
};

/**
 * GDPR: Șterge contul curent și toate datele asociate.
 * Apelează Edge Function delete-account, apoi deconectează.
 * Returnează { error: null } la succes sau { error } la eșec.
 */
export const deleteAccount = async (): Promise<{ error: Error | null }> => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return { error: sessionError ?? new Error('Nu ești autentificat.') };
  }

  const { data, error } = await supabase.functions.invoke('delete-account', {
    method: 'POST',
  });

  if (error) {
    return { error: new Error(error.message ?? 'Ștergerea contului a eșuat.') };
  }

  const body = data as { error?: string } | undefined;
  if (body?.error) {
    return { error: new Error(body.error) };
  }

  await supabase.auth.signOut();
  return { error: null };
};
