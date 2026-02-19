-- Users can view their own data
CREATE POLICY "Users can view own data"
ON public.users
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Admins can view all users
CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));