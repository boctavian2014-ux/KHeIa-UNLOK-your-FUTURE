import { supabase } from './supabase';

/**
 * Signs in with a test user for development.
 * @returns Session data from Supabase.
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
