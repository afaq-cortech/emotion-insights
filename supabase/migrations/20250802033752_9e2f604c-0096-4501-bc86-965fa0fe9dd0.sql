-- Add missing RLS policies for admin_users table

-- Allow INSERT for admin operations
CREATE POLICY "Allow admin insert access to admin_users" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (true);

-- Allow UPDATE for admin operations  
CREATE POLICY "Allow admin update access to admin_users" 
ON public.admin_users 
FOR UPDATE 
USING (true);

-- Allow DELETE for admin operations
CREATE POLICY "Allow admin delete access to admin_users" 
ON public.admin_users 
FOR DELETE 
USING (true);