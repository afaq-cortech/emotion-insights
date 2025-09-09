-- Add RLS policies to allow public read access to reactor_alerts for status updates
-- Allow public read access to Current alerts
CREATE POLICY "Allow public read access to current alerts" 
ON public.reactor_alerts 
FOR SELECT 
USING (alert_status = 'Current');

-- Allow public read access to Filtered alerts (demographic filtering will be handled in application)
CREATE POLICY "Allow public read access to filtered alerts" 
ON public.reactor_alerts 
FOR SELECT 
USING (alert_status = 'Filtered');