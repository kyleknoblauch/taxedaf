import { subscribeToOmnisend, trackOmnisendEvent } from './omnisendUtils';
import { updateProfileFromProvider } from './authUtils';

export const handleAuthStateChange = async (event: string, session: any | null) => {
  if (session?.user) {
    await updateProfileFromProvider(session.user);
    
    // Handle both email signups and social logins
    if (event === 'SIGNED_UP' || event === 'SIGNED_IN') {
      const email = session.user.email;
      const firstName = session.user.user_metadata?.first_name || 
                       session.user.user_metadata?.name?.split(' ')[0] ||
                       session.user.user_metadata?.preferred_username;
      const lastName = session.user.user_metadata?.last_name || 
                      (session.user.user_metadata?.name?.split(' ').slice(1).join(' ') || '');

      if (email) {
        try {
          // For social logins, we subscribe them by default since they provided email access
          if (session.user.app_metadata.provider !== 'email') {
            await subscribeToOmnisend(
              email,
              firstName,
              lastName
            );
            
            await trackOmnisendEvent(
              'Social Login',
              {
                email,
                first_name: firstName,
                last_name: lastName,
              },
              {
                provider: session.user.app_metadata.provider
              }
            );
          }
          
          // For email signups, we only track if they gave marketing consent
          else if (event === 'SIGNED_UP' && session.user.user_metadata?.marketing_consent) {
            await subscribeToOmnisend(
              email,
              firstName,
              lastName
            );
            
            await trackOmnisendEvent(
              'User Signed Up',
              {
                email,
                first_name: firstName,
                last_name: lastName,
              }
            );
          }
        } catch (error) {
          console.error('Error tracking signup/login in Omnisend:', error);
        }
      } else {
        console.warn('No email found for user during auth state change');
      }
    }
  }
};