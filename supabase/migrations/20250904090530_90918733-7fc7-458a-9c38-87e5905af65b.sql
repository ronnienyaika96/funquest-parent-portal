-- Fix critical security vulnerability: Add RLS policies to woocommerce_customers table
-- This table contains sensitive customer email data and currently has NO protection

-- Policy 1: Users can only view their own customer record
CREATE POLICY "Users can view their own customer data" 
ON public.woocommerce_customers 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy 2: Admins can view all customer records (using existing is_admin function)
CREATE POLICY "Admins can view all customer data" 
ON public.woocommerce_customers 
FOR SELECT 
USING (is_admin());

-- Policy 3: Service role can insert customer records (needed for WooCommerce webhooks)
CREATE POLICY "Service role can insert customer data" 
ON public.woocommerce_customers 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role'::text);

-- Policy 4: Service role can update customer records (needed for WooCommerce webhooks)
CREATE POLICY "Service role can update customer data" 
ON public.woocommerce_customers 
FOR UPDATE 
USING (auth.role() = 'service_role'::text);

-- Policy 5: Admins can update customer records (for admin management)
CREATE POLICY "Admins can update customer data" 
ON public.woocommerce_customers 
FOR UPDATE 
USING (is_admin());

-- Note: No DELETE policies - customer data should be preserved for compliance