import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, updateProfileFromProvider } from '@/utils/authUtils';
import { signInWithEmail, signUpWithEmail, signInWithTwitter, signInWithLinkedIn, signOut } from '@/utils/authOperations';
import { subscribeToOmnisend, trackOmnisendEvent } from '@/utils/omnisendUtils';
import { AuthChangeEvent } from '@supabase/supabase-js';

type AuthContextType = {
  user: any;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string, options?: { data?: { first_name?: string; last_name?: string } }) => Promise<any>;
  signInWithTwitter: () => Promise<any>;
  signInWithLinkedIn: () => Promise<any>;
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log('Auth state changed:', event, session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await updateProfileFromProvider(session.user);
        
        // Track signup event in Omnisend
        if (event === 'SIGNED_UP') {
          try {
            await subscribeToOmnisend(
              session.user.email!,
              session.user.user_metadata?.first_name,
              session.user.user_metadata?.last_name
            );
            
            await trackOmnisendEvent(
              'User Signed Up',
              {
                email: session.user.email!,
                first_name: session.user.user_metadata?.first_name,
                last_name: session.user.user_metadata?.last_name,
              }
            );
          } catch (error) {
            console.error('Error tracking signup in Omnisend:', error);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      console.log('Starting sign out process...');
      // First clear the user state
      setUser(null);
      // Then perform the actual sign out
      const result = await signOut();
      console.log('Sign out completed:', result);
      return result;
    } catch (error) {
      console.error('Sign out error in AuthProvider:', error);
      // Reset user state if sign out fails
      setUser(null);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signInWithEmail, 
      signUpWithEmail, 
      signInWithTwitter,
      signInWithLinkedIn, 
      signOut: handleSignOut 
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