-- 1. Allow parents to update their own children's profiles
CREATE POLICY "parent update own children"
ON public.child_profiles
FOR UPDATE
TO authenticated
USING (parent_id = auth.uid())
WITH CHECK (parent_id = auth.uid());

GRANT UPDATE ON public.child_profiles TO authenticated;

-- 2. Remove public read on the private "admin assets" bucket
DROP POLICY IF EXISTS "Public read admin assets" ON storage.objects;

CREATE POLICY "Admins can read admin assets"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'admin assets' AND has_role(auth.uid(), 'admin'::app_role));

-- 3. Remove stale policy referencing non-existent bucket name 'game_assets'
DROP POLICY IF EXISTS "game_assets_admin_write" ON storage.objects;