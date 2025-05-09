
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
    const { session_id, transaction_id } = await req.json();

    if (!session_id || !transaction_id) {
      return new Response(
        JSON.stringify({ error: "Missing session ID or transaction ID" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create Supabase client with service role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Check if payment is successful
    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ success: false, status: session.payment_status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Get transaction from database
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from("transactions")
      .select()
      .eq("id", transaction_id)
      .single();

    if (transactionError || !transaction) {
      return new Response(
        JSON.stringify({ error: "Transaction not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // If transaction is already completed, return success
    if (transaction.status === "completed") {
      const { data: reward } = await supabaseAdmin
        .from("rewards")
        .select()
        .eq("transaction_id", transaction_id)
        .single();

      return new Response(
        JSON.stringify({ success: true, already_processed: true, reward_id: reward?.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Update transaction status to completed
    await supabaseAdmin
      .from("transactions")
      .update({ 
        status: "completed",
        stripe_payment_intent_id: session.payment_intent,
        updated_at: new Date().toISOString()
      })
      .eq("id", transaction_id);

    // Create a reward record with an access token and expiration date (30 days)
    const accessToken = uuidv4();
    const expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + 30);

    const { data: reward, error: rewardError } = await supabaseAdmin
      .from("rewards")
      .insert({
        transaction_id: transaction_id,
        access_token: accessToken,
        expire_at: expireAt.toISOString(),
      })
      .select()
      .single();

    if (rewardError) {
      throw new Error(`Failed to create reward: ${rewardError.message}`);
    }

    // Update the transaction with the reward ID
    await supabaseAdmin
      .from("transactions")
      .update({ reward_id: reward.id })
      .eq("id", transaction_id);

    return new Response(
      JSON.stringify({ success: true, reward_id: reward.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
