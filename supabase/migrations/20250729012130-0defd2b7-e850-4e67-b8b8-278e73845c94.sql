-- Add admin policy to allow reading all user profiles for admin functionality
CREATE POLICY "Allow admin read access to all user profiles"
ON public.user_profiles 
FOR SELECT 
USING (true);