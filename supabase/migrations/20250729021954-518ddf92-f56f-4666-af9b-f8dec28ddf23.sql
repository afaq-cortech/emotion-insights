-- Enable Row Level Security on demo_prelim table
ALTER TABLE public.demo_prelim ENABLE ROW LEVEL SECURITY;

-- Allow public read access to demo_prelim table for demographic options
CREATE POLICY "Allow public read access to demo_prelim" 
ON public.demo_prelim 
FOR SELECT 
USING (true);