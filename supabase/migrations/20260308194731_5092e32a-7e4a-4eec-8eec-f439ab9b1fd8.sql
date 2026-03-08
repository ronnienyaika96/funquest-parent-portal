
-- RLS policies for subscriptions (plan catalog - publicly readable)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read active subscriptions"
ON public.subscriptions FOR SELECT
USING (true);

CREATE POLICY "admin manage subscriptions"
ON public.subscriptions FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS policies for user_subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own subscriptions"
ON public.user_subscriptions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "users insert own subscriptions"
ON public.user_subscriptions FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users update own subscriptions"
ON public.user_subscriptions FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "admin manage user_subscriptions"
ON public.user_subscriptions FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
