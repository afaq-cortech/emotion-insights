-- Add access_code column to user_profiles table if it doesn't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS access_code TEXT;