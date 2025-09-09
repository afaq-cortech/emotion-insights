-- Enable Row Level Security on subscription_choices table
ALTER TABLE public.subscription_choices ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read subscription choices
CREATE POLICY "Allow authenticated users to read subscription choices" 
ON public.subscription_choices 
FOR SELECT 
TO authenticated 
USING (true);