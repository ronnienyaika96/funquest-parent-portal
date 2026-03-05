
-- Badges: anyone authenticated can read, admins can manage
CREATE POLICY "authenticated read badges"
ON public.badges
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin insert badges"
ON public.badges
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin update badges"
ON public.badges
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin delete badges"
ON public.badges
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Child badges: parents can read their children's badges, admins can manage all
CREATE POLICY "parent read child badges"
ON public.child_badges
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM child_profiles c
    WHERE c.id = child_badges.child_id AND c.parent_id = auth.uid()
  )
);

CREATE POLICY "admin read all child badges"
ON public.child_badges
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin insert child badges"
ON public.child_badges
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin delete child badges"
ON public.child_badges
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));
