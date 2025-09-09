-- Add admin update policy for user_profiles table
CREATE POLICY "Allow admin update access to all user profiles" 
ON public.user_profiles 
FOR UPDATE 
USING (true);