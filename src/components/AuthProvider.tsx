import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type AuthContextType = {
  user: any;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string, options?: { data?: { first_name?: string; last_name?: string } }) => Promise<any>;
  signInWithTwitter: () => Promise<any>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        updateProfileFromProvider(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await updateProfileFromProvider(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateProfileFromProvider = async (user: any) => {
    if (!user?.user_metadata) return;

    const metadata = user.user_metadata;
    console.log('Processing user metadata:', metadata);

    // Simple name extraction - prioritize full_name
    const fullName = metadata.full_name || metadata.name || '';
    let firstName = fullName;
    let lastName = '';

    if (fullName.includes(' ')) {
      const nameParts = fullName.split(' ');
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ');
    }

    // If no name was found, use the username as firstName
    if (!firstName) {
      firstName = metadata.preferred_username || metadata.user_name || '';
    }

    console.log('Updating profile with:', { firstName, lastName });

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName || null,
          last_name: lastName || null
        })
        .eq('id', user.id)
        .select();

      if (error) {
        console.error('Profile update error:', error);
      } else {
        console.log('Profile updated successfully:', data);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { data, error: null };
  };

  const signUpWithEmail = async (email: string, password: string, options?: { data?: { first_name?: string; last_name?: string } }) => {
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

  const signInWithTwitter = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    });
    if (error) throw error;
    return { data, error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signInWithEmail, 
      signUpWithEmail, 
      signInWithTwitter, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};