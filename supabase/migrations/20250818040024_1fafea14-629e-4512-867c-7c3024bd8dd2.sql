-- Fix is_admin_session to schema-qualify is_current_user_admin reference
CREATE OR REPLACE FUNCTION public.is_admin_session()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  RETURN (
    (auth.uid() IS NOT NULL AND public.is_current_user_admin()) OR
    (auth.role() = 'anon' AND current_setting('request.jwt.claims', true)::json->>'role' = 'anon')
  );
END;
$function$;