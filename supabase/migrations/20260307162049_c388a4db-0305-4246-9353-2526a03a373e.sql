
-- Drop the restrictive published-only policy
DROP POLICY IF EXISTS "read published activities" ON public.activities;

-- Create a permissive policy so authenticated users can read all activities
-- (app code handles published-first filtering)
CREATE POLICY "authenticated read activities"
ON public.activities
FOR SELECT
TO authenticated
USING (true);
