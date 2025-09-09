-- Enable Row Level Security on demos table
ALTER TABLE public.demos ENABLE ROW LEVEL SECURITY;

-- Allow public read access to demos table for demographic options
CREATE POLICY "Allow public read access to demos" 
ON public.demos 
FOR SELECT 
USING (true);