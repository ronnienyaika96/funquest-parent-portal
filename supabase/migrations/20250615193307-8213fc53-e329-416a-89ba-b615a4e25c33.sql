
-- Replace the email below with your actual email if it is not correct!
-- Get your user id by email
INSERT INTO public.admin_roles (user_id)
SELECT id
FROM auth.users
WHERE email = 'ronniean75@gmail.com'
ON CONFLICT DO NOTHING;
