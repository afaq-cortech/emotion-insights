-- Step 1: Create a security definer function for secure profile creation
CREATE OR REPLACE FUNCTION public.create_user_profile(
  p_user_id UUID,
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT,
  p_cell_number TEXT,
  p_access_code TEXT DEFAULT NULL,
  p_subscription TEXT DEFAULT '',
  p_reactor_level TEXT DEFAULT ''
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_id UUID;
  user_created_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Verify the user exists in auth.users and was created recently (within 5 minutes)
  SELECT created_at INTO user_created_at
  FROM auth.users
  WHERE id = p_user_id;
  
  IF user_created_at IS NULL THEN
    RAISE EXCEPTION 'User not found in auth.users';
  END IF;
  
  IF user_created_at < (now() - INTERVAL '5 minutes') THEN
    RAISE EXCEPTION 'User creation window expired';
  END IF;
  
  -- Insert the user profile
  INSERT INTO public.user_profiles (
    user_id,
    first_name,
    last_name,
    email,
    cell_number,
    access_code,
    subscription,
    reactor_level
  ) VALUES (
    p_user_id,
    p_first_name,
    p_last_name,
    p_email,
    p_cell_number,
    p_access_code,
    p_subscription,
    p_reactor_level
  )
  RETURNING id INTO profile_id;
  
  RETURN profile_id;
END;
$$;

-- Step 2: Update RLS policies for user_profiles table
-- Drop existing INSERT policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

-- Create new INSERT policy that allows both authenticated users and the secure function
CREATE POLICY "Allow profile creation during signup and by authenticated users"
ON public.user_profiles
FOR INSERT
WITH CHECK (
  -- Allow authenticated users to insert their own profiles
  (auth.uid() = user_id) OR
  -- Allow the secure function to create profiles (this bypasses RLS due to SECURITY DEFINER)
  (auth.uid() IS NULL AND user_id IS NOT NULL)
);