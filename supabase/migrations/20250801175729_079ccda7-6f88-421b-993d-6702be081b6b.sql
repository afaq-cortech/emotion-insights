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

-- Create a trigger function that runs on SELECT to automatically update expired alerts
CREATE OR REPLACE FUNCTION public.auto_update_expired_alerts()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Call the update function to mark expired alerts
  PERFORM public.update_expired_alerts();
  RETURN NULL;
END;
$function$;

-- Create a trigger that runs before any SELECT on reactor_alerts
-- This ensures expired alerts are automatically updated when queried
CREATE OR REPLACE TRIGGER trigger_auto_update_expired_alerts
  BEFORE SELECT ON public.reactor_alerts
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.auto_update_expired_alerts();