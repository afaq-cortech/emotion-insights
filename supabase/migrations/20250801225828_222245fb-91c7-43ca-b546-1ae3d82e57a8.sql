-- Add policy to allow access code based user profile lookup for API
CREATE POLICY "Allow access code based profile lookup for API" 
ON public.user_profiles 
FOR SELECT 
USING (access_code IS NOT NULL);