import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const greetings = [
  (name) => `${name}, ready to crush those tax deductions? 💪`,
  (name) => `Back in action, ${name}! Let's tackle those taxes 📊`,
  (name) => `${name}, your tax-tracking superhero has arrived! ✨`,
  (name) => `Time to make those receipts count, ${name}! 📝`,
  (name) => `${name}, let's make tax season your favorite season! 🎯`,
  (name) => `Welcome back ${name}, your tax game is getting stronger! 💫`,
  (name) => `${name}, you're crushing this tax organization thing! 🏆`,
  (name) => `Ready to rock those tax calculations, ${name}? 🚀`,
  (name) => `${name}, you're a tax-tracking champion! 🌟`,
  (name) => `Let's make those deductions count, ${name}! 💎`,
  (name) => `${name}, your tax-savvy moves are paying off! 📈`,
  (name) => `Back for more tax mastery, ${name}? Let's go! 🎯`,
  (name) => `${name}, you're getting taxedAF organized! 🎨`,
  (name) => `Time to shine in your tax game, ${name}! ✨`,
  (name) => `${name}, ready for some tax-saving action? 💪`,
  (name) => `Your tax journey continues, ${name}! 🚀`,
  (name) => `${name}, making taxes less taxing! 😎`,
  (name) => `Back to conquer those taxes, ${name}! 👑`,
  (name) => `${name}, your tax organization is on point! 🎯`,
  (name) => `Ready to optimize those deductions, ${name}? 💫`
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName } = await req.json();
    console.log('Generating greeting for:', firstName);

    // Get random greeting from array
    const randomIndex = Math.floor(Math.random() * greetings.length);
    const greetingFunction = greetings[randomIndex];
    const greeting = greetingFunction(firstName);

    console.log('Selected greeting:', greeting);

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
        greeting: `Welcome back, ${firstName}! Ready to tackle those taxes?`,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  }
});