
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") || "";
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Verify webhook signature
    let event;
    try {
      const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
      if (!webhookSecret) {
        throw new Error("Missing Stripe webhook secret");
      }
      
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Create Supabase client with service role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Process different Stripe events
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const transactionId = session.metadata?.transaction_id;
        
        if (!transactionId) {
          console.error("No transaction ID found in session metadata");
          break;
        }
        
        // Update transaction status to completed
        await supabaseAdmin
          .from("transactions")
          .update({ 
            status: "completed",
            stripe_payment_intent_id: session.payment_intent,
            updated_at: new Date().toISOString()
          })
          .eq("id", transactionId);
        
        // Create a reward record with an access token and expiration date (30 days)
        const accessToken = uuidv4();
        const expireAt = new Date();
        expireAt.setDate(expireAt.getDate() + 30);
        
        const { data: reward, error: rewardError } = await supabaseAdmin
          .from("rewards")
          .insert({
            transaction_id: transactionId,
            access_token: accessToken,
            expire_at: expireAt.toISOString(),
          })
          .select()
          .single();
        
        if (rewardError) {
          console.error(`Failed to create reward: ${rewardError.message}`);
          break;
        }
        
        // Update the transaction with the reward ID
        await supabaseAdmin
          .from("transactions")
          .update({ reward_id: reward.id })
          .eq("id", transactionId);
        
        console.log(`Payment successful for transaction ${transactionId}`);
        break;
      }
      
      case "checkout.session.expired": {
        const session = event.data.object;
        const transactionId = session.metadata?.transaction_id;
        
        if (!transactionId) {
          console.error("No transaction ID found in session metadata");
          break;
        }
        
        // Update transaction status to expired
        await supabaseAdmin
          .from("transactions")
          .update({ 
            status: "expired",
            updated_at: new Date().toISOString()
          })
          .eq("id", transactionId);
        
        console.log(`Payment session expired for transaction ${transactionId}`);
        break;
      }
      
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const sessionId = paymentIntent.metadata?.session_id;
        
        if (sessionId) {
          // Find transaction by session ID
          const { data: transaction } = await supabaseAdmin
            .from("transactions")
            .select()
            .eq("stripe_session_id", sessionId)
            .single();
          
          if (transaction) {
            // Update transaction status to failed
            await supabaseAdmin
              .from("transactions")
              .update({ 
                status: "failed",
                updated_at: new Date().toISOString()
              })
              .eq("id", transaction.id);
            
            console.log(`Payment failed for transaction ${transaction.id}`);
          }
        }
        break;
      }
    }
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});
