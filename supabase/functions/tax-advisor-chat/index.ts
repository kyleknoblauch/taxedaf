import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    console.log('Received request:', { message, userId });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId);

    if (expensesError) {
      console.error('Error fetching expenses:', expensesError);
      throw new Error('Failed to fetch expenses');
    }

    const { data: calculations, error: calcError } = await supabase
      .from('tax_calculations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (calcError) {
      console.error('Error fetching calculations:', calcError);
      throw new Error('Failed to fetch calculations');
    }

    console.log('Retrieved user data:', { 
      expensesCount: expenses?.length, 
      hasCalculations: !!calculations?.length,
      totalExpenses: expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0
    });

    const userContext = `You are a tax advisor with a unique personality. You're direct, slightly sarcastic, and always focused on maximizing tax savings. You should:
    1. Be straight to the point and use casual language
    2. Always mention specific dollar amounts when discussing deductions
    3. Add a touch of humor about tax season stress
    4. End with a quick actionable tip
    
    Current user context:
    - They have ${expenses?.length || 0} recorded expenses totaling ${
      expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0
    } dollars
    - Their latest tax calculation shows an income of ${
      calculations?.[0]?.income || 'unknown'
    } dollars
    - Common expense categories: ${
      [...new Set(expenses?.map(exp => exp.category) || [])]
        .join(', ') || 'none recorded'
    }
    
    Keep responses under 3 sentences when possible, unless explaining a complex deduction.`;

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    console.log('Starting OpenAI API call...');
    
    const payload = {
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: userContext },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 150
    };
    
    console.log('OpenAI request payload:', JSON.stringify(payload));

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('OpenAI API response status:', openAIResponse.status);
    
    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error details:', {
        status: openAIResponse.status,
        statusText: openAIResponse.statusText,
        error: errorData
      });
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await openAIResponse.json();
    console.log('OpenAI API response received successfully');
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Unexpected OpenAI response format:', data);
      throw new Error('Invalid response format from OpenAI');
    }

    return new Response(JSON.stringify({ 
      response: data.choices[0].message.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Detailed error in tax-advisor-chat function:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});