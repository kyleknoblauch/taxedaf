import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { firstName } = await req.json()
    
    // For now, we'll use a simple array of templates since Grok API isn't publicly available yet
    const templates = [
      `${firstName}, you're a tax hero! Slap one more invoice on there to get this tax math spot on.`,
      `Ready to crunch some numbers, ${firstName}? Your tax game is getting stronger!`,
      `${firstName}, looking sharp! Time to make those tax calculations work for you.`,
      `Tax season's got nothing on you, ${firstName}! Let's get those calculations rolling.`,
      `Welcome back ${firstName}! Ready to make those tax calculations precise AF?`,
      `${firstName}, you're crushing it! Another day, another perfectly calculated tax estimate.`
    ]
    
    const randomGreeting = templates[Math.floor(Math.random() * templates.length)]

    return new Response(
      JSON.stringify({ greeting: randomGreeting }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})