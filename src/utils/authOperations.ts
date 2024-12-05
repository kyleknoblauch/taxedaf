import { supabase } from './authUtils';

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return { data, error: null };
};

export const signUpWithEmail = async (email: string, password: string, options?: { data?: { first_name?: string; last_name?: string } }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: options?.data,
    },
  });
  if (error) return { data: null, error };
  return { data, error: null };
};

export const signInWithTwitter = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      redirectTo: window.location.origin + '/auth/callback',
    },
  });
  if (error) throw error;
  return { data, error: null };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return { error: null };
};