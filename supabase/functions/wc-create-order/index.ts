import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WC_BASE_URL = Deno.env.get("WC_BASE_URL") || "";
const WC_CONSUMER_KEY = Deno.env.get("WC_CONSUMER_KEY") || "";
const WC_CONSUMER_SECRET = Deno.env.get("WC_CONSUMER_SECRET") || "";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!WC_BASE_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      return new Response(
        JSON.stringify({ error: "WooCommerce secrets missing: WC_BASE_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { items = [], user_id } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "No items provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const line_items = items.map((it: any) => ({
      product_id: Number(it.id),
      quantity: Number(it.quantity) || 1,
    }));

    const base = WC_BASE_URL.replace(/\/$/, "");
    const url = new URL(`${base}/wp-json/wc/v3/orders`);
    url.searchParams.set("consumer_key", WC_CONSUMER_KEY);
    url.searchParams.set("consumer_secret", WC_CONSUMER_SECRET);

    const orderPayload: any = {
      payment_method: "",
      payment_method_title: "",
      set_paid: false,
      line_items,
      meta_data: user_id ? [{ key: "supabase_user_id", value: String(user_id) }] : [],
    };

    const createRes = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    const order = await createRes.json();

    if (!createRes.ok) {
      console.error("wc-create-order error:", order);
      return new Response(JSON.stringify({ error: order?.message || "Failed to create order" }), {
        status: createRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const orderId = order.id;
    const orderKey = order.order_key;
    const checkout_url = `${base}/checkout/order-pay/${orderId}/?pay_for_order=true&key=${orderKey}`;

    return new Response(JSON.stringify({ order_id: orderId, order_key: orderKey, checkout_url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("wc-create-order exception:", err);
    return new Response(JSON.stringify({ error: err?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});