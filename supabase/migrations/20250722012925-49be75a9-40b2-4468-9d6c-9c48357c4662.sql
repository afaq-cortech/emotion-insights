-- Create function to verify admin password (simple implementation)
CREATE OR REPLACE FUNCTION public.verify_admin_password(email TEXT, password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Simple password comparison (in production, you'd hash passwords)
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.email = verify_admin_password.email 
    AND password_hash = verify_admin_password.password
  );
END;
$$;