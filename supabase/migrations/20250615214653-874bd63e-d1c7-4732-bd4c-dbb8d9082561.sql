
-- Enable RLS (if not already enabled)
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own children
CREATE POLICY "Users can view their own child profiles"
ON public.child_profiles
FOR SELECT
USING (parent_id = auth.uid());

-- Allow users to insert their own children
CREATE POLICY "Users can insert their own child profiles"
ON public.child_profiles
FOR INSERT
WITH CHECK (parent_id = auth.uid());

-- Allow users to update their own children
CREATE POLICY "Users can update their own child profiles"
ON public.child_profiles
FOR UPDATE
USING (parent_id = auth.uid());

-- Allow users to delete their own children
CREATE POLICY "Users can delete their own child profiles"
ON public.child_profiles
FOR DELETE
USING (parent_id = auth.uid());
