-- Update missing reactor_ids for the 2 users who don't have them
-- Following the existing pattern of R001xxx format

UPDATE public.user_profiles 
SET reactor_id = 'R001101' 
WHERE email = 'jon@emotioninsights.com' 
  AND (reactor_id IS NULL OR reactor_id = '');

UPDATE public.user_profiles 
SET reactor_id = 'R001102' 
WHERE email = 'boo.merbob2@gmail.com' 
  AND (reactor_id IS NULL OR reactor_id = '');