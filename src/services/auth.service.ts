import { supabase } from './supabase';

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
 * Signs in with a test user for development.
 */
export const signInTestUser = async () => {
  const email = 'test-user@edumat.local';
  const password = 'test-user-password';
  return supabase.auth.signInWithPassword({ email, password });
};

/**
 * Signs out the current user.
 */
export const signOut = async () => {
  return supabase.auth.signOut();
};
