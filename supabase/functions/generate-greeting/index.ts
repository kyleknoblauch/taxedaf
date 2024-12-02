import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('openAI');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName } = await req.json();
    console.log('Generating greeting for:', firstName);
    console.log('OpenAI API Key exists:', !!openAIApiKey);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a friendly tax assistant. Generate a short, casual greeting that mentions taxes or finances in a fun way. Keep responses under 60 characters and always include the provided first name.'
          },
          { 
            role: 'user', 
            content: `Generate a casual, tax-themed greeting for ${firstName}.`
          }
        ],
        temperature: 0.9,
        max_tokens: 60,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate greeting');
    }

    const data = await response.json();
    console.log('OpenAI Response:', data);
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    return new Response(
      JSON.stringify({ greeting: data.choices[0].message.content.trim() }),
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
        status: 200, // Still return 200 to not break the UI
      },
    );
  }
});