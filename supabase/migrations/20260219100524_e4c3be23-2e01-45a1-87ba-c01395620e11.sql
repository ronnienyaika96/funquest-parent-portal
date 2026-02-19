-- Admin can read all profiles (for user management)
CREATE POLICY "admin read all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can read all child_profiles
CREATE POLICY "admin read all child_profiles"
ON public.child_profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Parents can read their own children
CREATE POLICY "parent read own children"
ON public.child_profiles
FOR SELECT
TO authenticated
USING (parent_id = auth.uid());

-- Parents can manage own children
CREATE POLICY "parent insert own children"
ON public.child_profiles
FOR INSERT
TO authenticated
WITH CHECK (parent_id = auth.uid());

CREATE POLICY "parent delete own children"
ON public.child_profiles
FOR DELETE
TO authenticated
USING (parent_id = auth.uid());

-- Admin can read all progress
CREATE POLICY "admin read all progress"
ON public.progress
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can delete progress (for reset)
CREATE POLICY "admin delete progress"
ON public.progress
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Parents can read their children's progress
CREATE POLICY "parent read child progress"
ON public.progress
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.child_profiles c
    WHERE c.id = progress.child_id AND c.parent_id = auth.uid()
  )
);