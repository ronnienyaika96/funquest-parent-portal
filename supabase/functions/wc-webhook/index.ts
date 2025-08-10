import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const WC_WEBHOOK_SECRET = Deno.env.get("WC_WEBHOOK_SECRET") || "";

async function verifyWooSignature(rawBody: string, signature: string | null) {
  if (!WC_WEBHOOK_SECRET || !signature) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(WC_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const digest = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return b64 === signature;
}

function getUserIdFromMeta(meta: any[]): string | null {
  try {
    const item = Array.isArray(meta) ? meta.find((m) => m?.key === "supabase_user_id") : null;
    const val = item?.value ? String(item.value) : null;
    // basic uuid check
    return val && /[0-9a-fA-F-]{36}/.test(val) ? val : null;
  } catch (_) {
    return null;
  }
}

function mapLineItems(items: any[]): any[] {
  if (!Array.isArray(items)) return [];
  return items.map((li) => ({
    id: li?.id ?? null,
    product_id: li?.product_id ?? null,
    name: li?.name ?? "",
    quantity: Number(li?.quantity ?? 0),
    total: Number(li?.total ?? 0),
    price: Number(li?.price ?? li?.subtotal ?? 0),
    sku: li?.sku ?? null,
  }));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const rawBody = await req.text();
    const topic = req.headers.get("x-wc-webhook-topic");
    const signature = req.headers.get("x-wc-webhook-signature");

    const valid = await verifyWooSignature(rawBody, signature);
    if (!valid) {
      console.error("wc-webhook invalid signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = JSON.parse(rawBody);

    // Only process order.* events
    if (!topic || !topic.startsWith("order.")) {
      return new Response(JSON.stringify({ ok: true, ignored: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const woo_order_id = Number(payload?.id);
    const status = String(payload?.status ?? "");
    const total = Number(payload?.total ?? 0);
    const currency = String(payload?.currency ?? "");
    const woo_customer_id = payload?.customer_id ? Number(payload.customer_id) : null;
    const user_id = getUserIdFromMeta(payload?.meta_data);
    const line_items = mapLineItems(payload?.line_items);

    // Upsert style: try to find existing by woo_order_id
    const { data: existing, error: fetchErr } = await supabase
      .from("woocommerce_orders")
      .select("id")
      .eq("woo_order_id", woo_order_id)
      .maybeSingle();

    if (fetchErr) {
      console.error("wc-webhook fetch existing error:", fetchErr);
    }

    if (existing?.id) {
      const { error: updErr } = await supabase
        .from("woocommerce_orders")
        .update({
          status,
          total,
          currency,
          line_items,
          metadata: payload?.meta_data ?? null,
          user_id,
          woo_customer_id,
        })
        .eq("id", existing.id);

      if (updErr) {
        console.error("wc-webhook update error:", updErr);
        return new Response(JSON.stringify({ error: updErr.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      const { error: insErr } = await supabase
        .from("woocommerce_orders")
        .insert({
          woo_order_id,
          status,
          total,
          currency,
          line_items,
          metadata: payload?.meta_data ?? null,
          user_id,
          woo_customer_id,
        });

      if (insErr) {
        console.error("wc-webhook insert error:", insErr);
        return new Response(JSON.stringify({ error: insErr.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("wc-webhook exception:", err);
    return new Response(JSON.stringify({ error: err?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
