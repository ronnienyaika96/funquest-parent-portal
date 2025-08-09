import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WC_BASE_URL = Deno.env.get("WC_BASE_URL") || "";
const WC_CONSUMER_KEY = Deno.env.get("WC_CONSUMER_KEY") || "";
const WC_CONSUMER_SECRET = Deno.env.get("WC_CONSUMER_SECRET") || "";

function stripHtml(html: string | null | undefined) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

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

    const { search = "", page = 1, per_page = 50 } = await req.json().catch(() => ({}));

    const base = WC_BASE_URL.replace(/\/$/, "");
    const url = new URL(`${base}/wp-json/wc/v3/products`);
    url.searchParams.set("status", "publish");
    url.searchParams.set("per_page", String(per_page));
    url.searchParams.set("page", String(page));
    if (search) url.searchParams.set("search", search);
    url.searchParams.set("consumer_key", WC_CONSUMER_KEY);
    url.searchParams.set("consumer_secret", WC_CONSUMER_SECRET);

    const res = await fetch(url.toString());
    const products = await res.json();

    if (!res.ok) {
      console.error("wc-products error:", products);
      return new Response(JSON.stringify({ error: products?.message || "WooCommerce error" }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mapped = (Array.isArray(products) ? products : []).map((p: any) => {
      const price = parseFloat(p.price ?? "0");
      const regular = parseFloat(p.regular_price ?? p.price ?? "0");
      const images = Array.isArray(p.images) ? p.images.map((img: any) => img.src) : [];
      const badge = p.on_sale ? "Sale" : p.featured ? "Best Seller" : undefined;
      return {
        id: String(p.id),
        title: p.name,
        short_description: stripHtml(p.short_description),
        long_description: stripHtml(p.description),
        price: isNaN(price) ? 0 : price,
        original_price: isNaN(regular) ? undefined : regular,
        category: p.categories?.[0]?.name || "General",
        badge,
        image_url: images[0] || undefined,
        images,
        status: p.status === "publish" ? "active" : p.status,
        created_at: p.date_created || p.date_created_gmt || null,
        updated_at: p.date_modified || p.date_modified_gmt || null,
        // UI-friendly aliases
        image: images[0] || undefined,
        shortDescription: stripHtml(p.short_description),
        originalPrice: isNaN(regular) ? undefined : regular,
      };
    });

    return new Response(JSON.stringify(mapped), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("wc-products exception:", err);
    return new Response(JSON.stringify({ error: err?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});