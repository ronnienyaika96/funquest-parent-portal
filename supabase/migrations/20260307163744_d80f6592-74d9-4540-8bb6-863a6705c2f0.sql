
-- Fix infinite recursion on admins table
-- Drop all self-referencing policies
DROP POLICY IF EXISTS "Admins can read admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can insert admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can delete admins" ON public.admins;
DROP POLICY IF EXISTS "admin can read own row" ON public.admins;

-- Replace with non-recursive policies using direct auth.uid() check
CREATE POLICY "admin read own row" ON public.admins FOR SELECT
  TO authenticated USING (id = auth.uid());

CREATE POLICY "admin insert" ON public.admins FOR INSERT
  TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin delete" ON public.admins FOR DELETE
  TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Fix activities: drop admin policies that query admins table, keep simple authenticated read
DROP POLICY IF EXISTS "admin read all activities" ON public.activities;
DROP POLICY IF EXISTS "admin delete activities" ON public.activities;
DROP POLICY IF EXISTS "admin insert activities" ON public.activities;
DROP POLICY IF EXISTS "admin update activities" ON public.activities;
DROP POLICY IF EXISTS "Authenticated users can read activities" ON public.activities;

-- Admin policies using has_role (no admins table recursion)
CREATE POLICY "admin manage activities" ON public.activities FOR ALL
  TO authenticated USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Fix activity_steps: same pattern
DROP POLICY IF EXISTS "admin read all steps" ON public.activity_steps;
DROP POLICY IF EXISTS "admin delete steps" ON public.activity_steps;
DROP POLICY IF EXISTS "admin insert steps" ON public.activity_steps;
DROP POLICY IF EXISTS "admin update steps" ON public.activity_steps;

CREATE POLICY "admin manage steps" ON public.activity_steps FOR ALL
  TO authenticated USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Fix audit_logs
DROP POLICY IF EXISTS "admin read logs" ON public.audit_logs;
DROP POLICY IF EXISTS "admin write logs" ON public.audit_logs;

CREATE POLICY "admin read logs" ON public.audit_logs FOR SELECT
  TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin write logs" ON public.audit_logs FOR INSERT
  TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));

-- Fix game_sessions
DROP POLICY IF EXISTS "admin read sessions" ON public.game_sessions;

CREATE POLICY "admin read sessions" ON public.game_sessions FOR SELECT
  TO authenticated USING (has_role(auth.uid(), 'admin'));
