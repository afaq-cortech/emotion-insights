-- Enable RLS on reactor_warnings table
ALTER TABLE public.reactor_warnings ENABLE ROW LEVEL SECURITY;

-- Allow admin read access to reactor_warnings
CREATE POLICY "Allow admin read access to reactor_warnings" 
ON public.reactor_warnings 
FOR SELECT 
USING (is_current_user_admin() OR is_admin_session());

-- Allow admin insert access to reactor_warnings
CREATE POLICY "Allow admin insert access to reactor_warnings" 
ON public.reactor_warnings 
FOR INSERT 
WITH CHECK (is_current_user_admin() OR is_admin_session());

-- Allow admin update access to reactor_warnings
CREATE POLICY "Allow admin update access to reactor_warnings" 
ON public.reactor_warnings 
FOR UPDATE 
USING (is_current_user_admin() OR is_admin_session())
WITH CHECK (is_current_user_admin() OR is_admin_session());

-- Allow admin delete access to reactor_warnings
CREATE POLICY "Allow admin delete access to reactor_warnings" 
ON public.reactor_warnings 
FOR DELETE 
USING (is_current_user_admin() OR is_admin_session());