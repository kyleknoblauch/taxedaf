import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const KLAVIYO_API_KEY = Deno.env.get('KLAVIYO_PRIVATE_KEY');
const KLAVIYO_LIST_ID = Deno.env.get('KLAVIYO_LIST_ID');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KlaviyoEvent {
  eventName: string;
  customerProperties: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
  properties?: Record<string, any>;
}

async function trackEvent(event: KlaviyoEvent) {
  const response = await fetch('https://a.klaviyo.com/api/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: 'event',
        attributes: {
          profile: {
            email: event.customerProperties.email,
            first_name: event.customerProperties.first_name,
            last_name: event.customerProperties.last_name,
          },
          metric: {
            name: event.eventName,
          },
          properties: event.properties,
        },
      },
    }),
  });

  if (!response.ok) {
    console.error('Klaviyo track event error:', await response.text());
    throw new Error('Failed to track event in Klaviyo');
  }

  return response.json();
}

async function addToList(email: string, firstName?: string, lastName?: string) {
  const response = await fetch(`https://a.klaviyo.com/api/lists/${KLAVIYO_LIST_ID}/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: 'profile',
        attributes: {
          email,
          first_name: firstName,
          last_name: lastName,
        },
      },
    }),
  });

  if (!response.ok) {
    console.error('Klaviyo add to list error:', await response.text());
    throw new Error('Failed to add subscriber to Klaviyo list');
  }

  return response.json();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...data } = await req.json();
    console.log(`Processing Klaviyo ${action} request:`, data);

    let result;
    switch (action) {
      case 'track':
        result = await trackEvent(data as KlaviyoEvent);
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
    console.error('Error in Klaviyo function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});