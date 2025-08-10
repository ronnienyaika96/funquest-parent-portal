-- Enable RLS and add secure policies for WooCommerce orders

-- Enable Row Level Security on woocommerce_orders
ALTER TABLE public.woocommerce_orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own Woo orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'woocommerce_orders' AND policyname = 'Users can view their own Woo orders'
  ) THEN
    CREATE POLICY "Users can view their own Woo orders"
    ON public.woocommerce_orders
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Policy: Admins can view all Woo orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'woocommerce_orders' AND policyname = 'Admins can view all Woo orders'
  ) THEN
    CREATE POLICY "Admins can view all Woo orders"
    ON public.woocommerce_orders
    FOR SELECT
    USING (is_admin());
  END IF;
END
$$;

-- Policy: Service role can insert Woo orders (for webhooks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'woocommerce_orders' AND policyname = 'Service role can insert Woo orders'
  ) THEN
    CREATE POLICY "Service role can insert Woo orders"
    ON public.woocommerce_orders
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');
  END IF;
END
$$;

-- Policy: Service role can update Woo orders (for webhooks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'woocommerce_orders' AND policyname = 'Service role can update Woo orders'
  ) THEN
    CREATE POLICY "Service role can update Woo orders"
    ON public.woocommerce_orders
    FOR UPDATE
    USING (auth.role() = 'service_role');
  END IF;
END
$$;

-- Helpful index for fast lookups by Woo order id
CREATE INDEX IF NOT EXISTS idx_woocommerce_orders_woo_order_id ON public.woocommerce_orders (woo_order_id);
