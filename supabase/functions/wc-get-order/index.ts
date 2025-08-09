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

    const { order_id } = await req.json();
    if (!order_id) {
      return new Response(JSON.stringify({ error: "order_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const base = WC_BASE_URL.replace(/\/$/, "");
    const url = new URL(`${base}/wp-json/wc/v3/orders/${order_id}`);
    url.searchParams.set("consumer_key", WC_CONSUMER_KEY);
    url.searchParams.set("consumer_secret", WC_CONSUMER_SECRET);

    const res = await fetch(url.toString());
    const order = await res.json();

    if (!res.ok) {
      console.error("wc-get-order error:", order);
      return new Response(JSON.stringify({ error: order?.message || "Failed to fetch order" }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ id: order.id, status: order.status, total: order.total, currency: order.currency }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("wc-get-order exception:", err);
    return new Response(JSON.stringify({ error: err?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});