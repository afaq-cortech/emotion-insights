-- Create function to update expired alerts
CREATE OR REPLACE FUNCTION public.update_expired_alerts()
RETURNS INTEGER
LANGUAGE plpgsql
AS $function$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Update alerts where end_date is before today and status is not already 'Expired'
  UPDATE public.reactor_alerts 
  SET alert_status = 'Expired'
  WHERE end_date < CURRENT_DATE 
    AND alert_status != 'Expired';
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  RETURN updated_count;
END;
$function$;

-- Update any currently expired alerts immediately
SELECT public.update_expired_alerts();