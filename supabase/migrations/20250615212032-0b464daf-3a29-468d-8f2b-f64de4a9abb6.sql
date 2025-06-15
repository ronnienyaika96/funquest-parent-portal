
-- 1. Child Profiles Table
CREATE TABLE public.child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL,
  name TEXT NOT NULL,
  age_range TEXT,
  avatar TEXT,
  school TEXT,
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS for child_profiles: Users can access/manipulate only their own children
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their children's profiles"
  ON public.child_profiles
  FOR SELECT
  USING (parent_id = auth.uid());

CREATE POLICY "Parents can insert their children's profiles"
  ON public.child_profiles
  FOR INSERT
  WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Parents can update their children's profiles"
  ON public.child_profiles
  FOR UPDATE
  USING (parent_id = auth.uid());

CREATE POLICY "Parents can delete their children's profiles"
  ON public.child_profiles
  FOR DELETE
  USING (parent_id = auth.uid());

-- 2. E-commerce Tables

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Users can insert orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update orders"
  ON public.orders
  FOR UPDATE
  USING (user_id = auth.uid());
CREATE POLICY "Users can delete orders"
  ON public.orders
  FOR DELETE
  USING (user_id = auth.uid());

-- Order Items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  title TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1
);

-- Minimal Subscription Management
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  duration_months INT NOT NULL DEFAULT 1
);

CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active'
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their subscriptions"
  ON public.user_subscriptions
  FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Users can insert subscriptions"
  ON public.user_subscriptions
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own subscriptions"
  ON public.user_subscriptions
  FOR UPDATE
  USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own subscriptions"
  ON public.user_subscriptions
  FOR DELETE
  USING (user_id = auth.uid());

-- 3. Enhanced profiles table (Add grade column as an example)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS grade TEXT;

-- 4. Trigger: Ensure every new Supabase auth user gets a profile in 'profiles' (already present in your schema).

-- 5. (NO destructive changes to any table.)

