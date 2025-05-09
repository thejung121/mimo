
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckoutRequest {
  packageId: string;
  packageTitle: string;
  packagePrice: number;
  creatorId: string;
  creatorName: string;
  userAlias: string;
  email?: string;
  whatsapp?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Parse request body
    const { packageId, packageTitle, packagePrice, creatorId, creatorName, userAlias, email, whatsapp } = await req.json() as CheckoutRequest;

    if (!packageId || !packageTitle || packagePrice === undefined || !creatorId || !userAlias) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create Supabase client with service role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Create transaction record (status: pending)
    // Calculate platform fee (10%)
    const platformFee = Math.floor(packagePrice * 0.1);
    const creatorAmount = packagePrice - platformFee;

    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from("transactions")
      .insert({
        package_id: packageId,
        creator_id: creatorId,
        buyer_alias: userAlias,
        buyer_email: email,
        buyer_whatsapp: whatsapp,
        amount: packagePrice,
        platform_fee: platformFee,
        creator_amount: creatorAmount,
        status: "pending"
      })
      .select()
      .single();

    if (transactionError) {
      throw new Error(`Failed to create transaction: ${transactionError.message}`);
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Mimo: ${packageTitle}`,
              description: `Para: ${creatorName}`,
            },
            unit_amount: packagePrice * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}&transaction_id=${transaction.id}`,
      cancel_url: `${req.headers.get("origin")}/pagamento-cancelado`,
      metadata: {
        transaction_id: transaction.id,
        creator_id: creatorId,
        package_id: packageId,
      },
    });

    // Update transaction with Stripe session ID
    await supabaseAdmin
      .from("transactions")
      .update({ stripe_session_id: session.id })
      .eq("id", transaction.id);

    // Return checkout URL
    return new Response(
      JSON.stringify({ url: session.url, transaction_id: transaction.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
