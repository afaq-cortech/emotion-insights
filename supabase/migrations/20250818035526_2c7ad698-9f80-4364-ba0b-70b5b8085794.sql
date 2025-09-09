-- Fix RLS policies for reactor_warnings table
-- Drop existing policies that use non-existent function
DROP POLICY IF EXISTS "Allow admin delete access to reactor_warnings" ON public.reactor_warnings;
DROP POLICY IF EXISTS "Allow admin insert access to reactor_warnings" ON public.reactor_warnings;
DROP POLICY IF EXISTS "Allow admin read access to reactor_warnings" ON public.reactor_warnings;
DROP POLICY IF EXISTS "Allow admin update access to reactor_warnings" ON public.reactor_warnings;

-- Create new policies using the existing is_admin_session function
CREATE POLICY "Allow admin access to reactor_warnings"
ON public.reactor_warnings
FOR ALL
USING (is_admin_session())
WITH CHECK (is_admin_session());