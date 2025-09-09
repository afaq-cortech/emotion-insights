-- Insert the correct admin user for the portal
INSERT INTO public.admin_users (email, password_hash) 
VALUES ('admin', 'password')
ON CONFLICT (email) DO NOTHING;