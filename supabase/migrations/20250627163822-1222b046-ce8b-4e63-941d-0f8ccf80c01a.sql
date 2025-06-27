
-- Enable RLS on child_profiles table and create policies for users to access their own children
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own children profiles
CREATE POLICY "Users can view their own children" 
  ON public.child_profiles 
  FOR SELECT 
  USING (auth.uid() = parent_id);

-- Allow users to insert their own children profiles
CREATE POLICY "Users can create their own children" 
  ON public.child_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = parent_id);

-- Allow users to update their own children profiles
CREATE POLICY "Users can update their own children" 
  ON public.child_profiles 
  FOR UPDATE 
  USING (auth.uid() = parent_id);

-- Allow users to delete their own children profiles
CREATE POLICY "Users can delete their own children" 
  ON public.child_profiles 
  FOR DELETE 
  USING (auth.uid() = parent_id);
