-- Enable RLS on reactor_alerts table
ALTER TABLE public.reactor_alerts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to read all reactor alerts
CREATE POLICY "Allow admin read access to reactor_alerts" 
ON public.reactor_alerts 
FOR SELECT 
USING (true);

-- Create policy to allow admins to insert reactor alerts
CREATE POLICY "Allow admin insert access to reactor_alerts" 
ON public.reactor_alerts 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow admins to update reactor alerts
CREATE POLICY "Allow admin update access to reactor_alerts" 
ON public.reactor_alerts 
FOR UPDATE 
USING (true);

-- Create policy to allow admins to delete reactor alerts
CREATE POLICY "Allow admin delete access to reactor_alerts" 
ON public.reactor_alerts 
FOR DELETE 
USING (true);