-- Enable RLS on subscription_choices table
ALTER TABLE public.subscription_choices ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read subscription choices
-- This is appropriate since streaming service options should be publicly readable
CREATE POLICY "Anyone can view subscription choices" 
ON public.subscription_choices 
FOR SELECT 
USING (true);