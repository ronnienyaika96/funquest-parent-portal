
-- Allow parents to INSERT progress for their children
CREATE POLICY "parent insert child progress"
ON public.progress
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM child_profiles c
    WHERE c.id = progress.child_id AND c.parent_id = auth.uid()
  )
);

-- Allow parents to UPDATE progress for their children
CREATE POLICY "parent update child progress"
ON public.progress
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM child_profiles c
    WHERE c.id = progress.child_id AND c.parent_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM child_profiles c
    WHERE c.id = progress.child_id AND c.parent_id = auth.uid()
  )
);
