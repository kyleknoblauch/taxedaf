import { subscribeToOmnisend, trackOmnisendEvent } from './omnisendUtils';
import { updateProfileFromProvider } from './authUtils';

export const handleAuthStateChange = async (event: string, session: any | null) => {
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
};