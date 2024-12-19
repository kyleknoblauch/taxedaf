import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/authUtils';
import { signInWithEmail, signUpWithEmail, signInWithTwitter, signInWithLinkedIn, signOut } from '@/utils/authOperations';
import { handleAuthStateChange } from '@/utils/authEventHandlers';

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
        handleAuthStateChange('INITIAL', session);
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setUser(session?.user ?? null);
      await handleAuthStateChange(event, session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      console.log('Starting sign out process...');
      setUser(null);
      const result = await signOut();
      console.log('Sign out completed:', result);
      return result;
    } catch (error) {
      console.error('Sign out error in AuthProvider:', error);
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