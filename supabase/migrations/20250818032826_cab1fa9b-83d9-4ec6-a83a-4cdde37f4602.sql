-- Fix the verify_admin_login function to use extensions.crypt
CREATE OR REPLACE FUNCTION public.verify_admin_login(input_email TEXT, input_password TEXT)
RETURNS TABLE (
  id UUID,
  login_id TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.login_id,
    au.email,
    au.created_at
  FROM admin_users au
  WHERE au.email = input_email 
    AND extensions.crypt(input_password, au.password_hash) = au.password_hash;
END;
$$;