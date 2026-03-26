import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { userId, offerConfig } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing userId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(
        JSON.stringify({ error: "Razorpay credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

    const orderData = {
      amount: 1000,
      currency: "INR",
      receipt: `activation_${userId}_${Date.now()}`,
      notes: {
        type: "activation",
        userId: userId,
        trialDays: offerConfig?.trialDays || 14,
        planAfterTrial: offerConfig?.planAfterTrial || "starter",
        affiliateId: offerConfig?.affiliateId || "",
      },
    };

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.text();
      console.error("Razorpay error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to create Razorpay order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const order = await razorpayResponse.json();

    return new Response(
      JSON.stringify({ orderId: order.id, amount: order.amount, currency: order.currency }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
