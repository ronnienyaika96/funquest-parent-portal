
INSERT INTO public.subscriptions (plan, slug, audience, billing_period, price, currency, description, features, max_child_profiles, games_per_day, is_active, is_popular, sort_order) VALUES
('Starter', 'starter-monthly', 'parent', 'monthly', 0, 'USD', 'Perfect for trying out FunQuest', '["3 games per day", "1 child profile", "Basic progress tracking", "Ad-supported"]', 1, 3, true, false, 1),
('Starter', 'starter-yearly', 'parent', 'yearly', 0, 'USD', 'Perfect for trying out FunQuest', '["3 games per day", "1 child profile", "Basic progress tracking", "Ad-supported"]', 1, 3, true, false, 2),
('Family', 'family-monthly', 'parent', 'monthly', 9.99, 'USD', 'Best for growing families', '["Unlimited games", "Up to 4 child profiles", "Detailed progress reports", "Ad-free experience", "Offline mode", "Priority support"]', 4, null, true, true, 3),
('Family', 'family-yearly', 'parent', 'yearly', 79.99, 'USD', 'Best for growing families', '["Unlimited games", "Up to 4 child profiles", "Detailed progress reports", "Ad-free experience", "Offline mode", "Priority support"]', 4, null, true, true, 4);
