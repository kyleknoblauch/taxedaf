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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user's financial data
    const { data: expenses } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId);

    const { data: calculations } = await supabase
      .from('tax_calculations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    // Create a context from user's data
    const userContext = `
      Based on the user's financial data:
      - They have ${expenses?.length || 0} recorded expenses totaling ${
        expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0
      } dollars.
      - Their latest tax calculation shows an income of ${
        calculations?.[0]?.income || 'unknown'
      } dollars.
      - Common expense categories: ${
        [...new Set(expenses?.map(exp => exp.category) || [])]
          .join(', ') || 'none recorded'
      }.
      
      As a tax advisor, provide personalized advice considering this information.
      Focus on potential deductions, tax savings, and financial planning.
      Keep responses concise and actionable.
    `;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('openAI')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: userContext
          },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get AI response');
    }

    return new Response(JSON.stringify({ 
      response: data.choices[0].message.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in tax-advisor-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});