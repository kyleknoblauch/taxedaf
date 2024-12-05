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
  signOut: () => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setUser(session?.user ?? null);
      if (session?.user) {
        updateProfileFromProvider(session.user);
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session);
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

    // Extract name from metadata
    const fullName = metadata.full_name || metadata.name || '';
    let firstName = fullName;
    let lastName = '';

    if (fullName.includes(' ')) {
      const nameParts = fullName.split(' ');
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ');
    }

    // If no name was found, try username
    if (!firstName) {
      firstName = metadata.preferred_username || metadata.user_name || '';
    }

    console.log('Attempting profile update with:', { firstName, lastName });

    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // If profile doesn't exist, insert it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              first_name: firstName || null,
              last_name: lastName || null
            }
          ]);

        if (insertError) {
          console.error('Profile insert error:', insertError);
          return;
        }
      } else {
        // If profile exists, update it
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            first_name: firstName || null,
            last_name: lastName || null
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Profile update error:', updateError);
          return;
        }
      }

      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Profile operation failed:', error);
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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    return { error: null };
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