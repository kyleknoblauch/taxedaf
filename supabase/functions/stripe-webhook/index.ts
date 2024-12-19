import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { trackOmnisendEvent } from "../_shared/omnisend.ts";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response("No signature", { status: 400 });
    }

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    );

    const customer = await stripe.customers.retrieve(
      event.data.object.customer as string
    );
    const customerEmail = customer.email;

    if (!customerEmail) {
      throw new Error('No customer email found');
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const mode = session.mode;
        const amount = session.amount_total ? session.amount_total / 100 : 0;

        await trackOmnisendEvent(
          'Purchase Completed',
          { email: customerEmail },
          { 
            plan_type: mode === 'subscription' ? 'quarterly' : 'lifetime',
            amount
          }
        );
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        await trackOmnisendEvent(
          'Checkout Abandoned',
          { email: customerEmail },
          { 
            plan_type: expiredSession.mode === 'subscription' ? 'quarterly' : 'lifetime'
          }
        );
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});