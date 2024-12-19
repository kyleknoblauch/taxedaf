import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OMNISEND_API_KEY = Deno.env.get('OMNISEND_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OmnisendEvent {
  eventName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  properties?: Record<string, any>;
}

async function trackEvent(event: OmnisendEvent) {
  const response = await fetch('https://api.omnisend.com/v3/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': OMNISEND_API_KEY!,
    },
    body: JSON.stringify({
      email: event.email,
      name: event.eventName,
      properties: {
        ...event.properties,
        firstName: event.firstName,
        lastName: event.lastName,
      },
    }),
  });

  if (!response.ok) {
    console.error('Omnisend track event error:', await response.text());
    throw new Error('Failed to track event in Omnisend');
  }

  return response.json();
}

async function addToList(email: string, firstName?: string, lastName?: string) {
  const response = await fetch('https://api.omnisend.com/v3/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': OMNISEND_API_KEY!,
    },
    body: JSON.stringify({
      email,
      firstName,
      lastName,
      status: 'subscribed',
    }),
  });

  if (!response.ok) {
    console.error('Omnisend add to list error:', await response.text());
    throw new Error('Failed to add subscriber to Omnisend');
  }

  return response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...data } = await req.json();
    console.log(`Processing Omnisend ${action} request:`, data);

    let result;
    switch (action) {
      case 'track':
        result = await trackEvent(data as OmnisendEvent);
        break;
      case 'subscribe':
        result = await addToList(
          data.email,
          data.firstName,
          data.lastName
        );
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in Omnisend function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});