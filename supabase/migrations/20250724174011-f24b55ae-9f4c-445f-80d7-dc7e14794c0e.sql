-- Add UPDATE policy for user_profiles table so users can update their own profiles
CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);