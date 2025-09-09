-- Ensure RLS is enabled on reactor_warnings
ALTER TABLE public.reactor_warnings ENABLE ROW LEVEL SECURITY;

-- Create missing is_current_user_admin() function to satisfy existing policies anywhere
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM admin_users au
    JOIN auth.users u ON u.email::text = au.email
    WHERE u.id = auth.uid()
  );
$$;