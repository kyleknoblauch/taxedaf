import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const greetings = [
  (name) => `Hey ${name}, back to see how much Uncle Sam will bleed you for? Add another invoice.`,
  (name) => `Welcome back, ${name}. Let's add another invoice so we can calculate how much the Man will leech from you.`,
  (name) => `Ah, ${name}, you're back. Another invoice for the state to siphon off your hard-earned cash?`,
  (name) => `Look who's here, ${name}! Let's give the tax vampires more to grin about with another invoice.`,
  (name) => `Hi again, ${name}! You're back to see how much more the system can wring out of you with another invoice.`,
  (name) => `Greetings, ${name}! Time to calculate just how much the government will pilfer with one more invoice.`,
  (name) => `Yo, ${name}, back to see how much the taxman will pilfer? Let's add another invoice to the mix.`,
  (name) => `Hey there, ${name}, back to feed the tax beast another invoice. Let's see how much they'll take.`,
  (name) => `Welcome back, ${name}, to see how much the bureaucracy will gouge? Another invoice to predict.`,
  (name) => `Good to see you, ${name}! Let's figure out how much more the tax collectors will squeeze with another invoice.`
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName } = await req.json();
    console.log('Received request with firstName:', firstName);

    if (!firstName) {
      console.error('No firstName provided in request');
      throw new Error('firstName is required');
    }

    // Get random greeting from array
    const randomIndex = Math.floor(Math.random() * greetings.length);
    const greetingFunction = greetings[randomIndex];
    const greeting = greetingFunction(firstName);

    console.log('Generated greeting:', greeting);

    return new Response(
      JSON.stringify({ greeting }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in generate-greeting function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});