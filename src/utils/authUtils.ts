import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const updateProfileFromProvider = async (user: any) => {
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