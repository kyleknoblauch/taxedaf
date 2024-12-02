import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const greetings = [
  (name) => `${name}, you're a tax wizard. Add another invoice to perfect this tax dance.`,
  (name) => `${name}, you're the king of taxes. Throw in another invoice for the grand tax tally.`,
  (name) => `${name}, you're a tax rockstar. Drop another invoice to tune up your tax payment.`,
  (name) => `${name}, you're the tax maestro. Add one more invoice to orchestrate your tax bill.`,
  (name) => `${name}, you're the tax guru. Pop another invoice in there for the ultimate tax calculation.`,
  (name) => `${name}, you're a tax ninja. Slip one more invoice in to sharpen your tax payment.`,
  (name) => `${name}, you're a tax beast. Toss another invoice into the mix for a beastly tax calculation.`,
  (name) => `${name}, you're the tax sage. Include another invoice to wise up your tax payment.`,
  (name) => `${name}, you're the tax jester. Joke one more invoice into the equation for a laugh-worthy tax sum.`,
  (name) => `${name}, you're the tax captain. Navigate another invoice into your tax voyage for accuracy.`,
  (name) => `${name}, you're the tax alchemist. Transmute another invoice to refine your tax gold.`,
  (name) => `${name}, you're the tax chef. Stir another invoice into the pot for a savory tax recipe.`,
  (name) => `${name}, you're the tax mechanic. Tune up your tax engine with one more invoice.`,
  (name) => `${name}, you're the tax artist. Paint one more invoice into your tax masterpiece.`,
  (name) => `${name}, you're the tax architect. Design your tax payment with an additional invoice.`,
  (name) => `${name}, you're the tax detective. Solve the case with one more invoice in your tax investigation.`,
  (name) => `${name}, you're the tax gardener. Plant another invoice for a flourishing tax calculation.`,
  (name) => `${name}, you're the tax magician. Pull another invoice out of your hat for a magical tax sum.`,
  (name) => `${name}, you're the tax pilot. Fly another invoice into your tax flight plan for precision.`,
  (name) => `${name}, you're the tax tailor. Stitch one more invoice into your tax suit for a perfect fit.`
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