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
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
  return { data, error: null };
};

export const signInWithLinkedIn = async () => {
  console.log('Starting LinkedIn OIDC sign in process...');
  console.log('Current origin:', window.location.origin);
  console.log('Redirect URL:', `${window.location.origin}/auth/callback`);
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',  // Changed from 'linkedin' to 'linkedin_oidc'
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          response_type: 'code',
          scope: 'openid profile email',
        },
      },
    });
    
    console.log('LinkedIn OIDC sign in response:', { data, error });
    
    if (error) {
      console.error('LinkedIn OIDC sign in error:', error);
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('LinkedIn OIDC sign in caught error:', error);
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return { error: null };
};