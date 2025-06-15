
-- Enable Row Level Security for order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Optionally, create a default policy (no access unless more policies are added)
-- (You might want to add SELECT/INSERT policies later if needed.)

-- Enable Row Level Security for subscription_plans
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Optionally, create a default policy (no access unless more policies are added)
