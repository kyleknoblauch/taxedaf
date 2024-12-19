import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const OMNISEND_API_KEY = Deno.env.get('OMNISEND_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function syncUserToOmnisend(email: string, firstName?: string, lastName?: string) {
  console.log(`Syncing user to Omnisend: ${email}`);
  
  try {
    const response = await fetch('https://api.omnisend.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': OMNISEND_API_KEY,
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        status: 'subscribed',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to sync user to Omnisend: ${await response.text()}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error syncing to Omnisend:', error);
    throw error;
  }
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get all users with their profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*, auth.users!inner(email)');

    if (profilesError) {
      throw profilesError;
    }

    console.log(`Found ${profiles.length} profiles to sync`);

    // Sync each user to Omnisend
    const results = await Promise.allSettled(
      profiles.map(async (profile: any) => {
        if (!profile.auth.users.email) {
          console.log(`Skipping profile ${profile.id} - no email found`);
          return;
        }

        return await syncUserToOmnisend(
          profile.auth.users.email,
          profile.first_name,
          profile.last_name
        );
      })
    );

    // Count successes and failures
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return new Response(
      JSON.stringify({
        message: `Sync completed. ${succeeded} succeeded, ${failed} failed.`,
        total: profiles.length,
        succeeded,
        failed,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in sync-omnisend function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});