-- Create access codes table for managing registration codes
CREATE TABLE IF NOT EXISTS public.access_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  is_used BOOLEAN NOT NULL DEFAULT false,
  used_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Create user profiles table for additional user information
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  cell_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for access_codes (public access for validation)
CREATE POLICY "Allow public read access for validation" 
ON public.access_codes 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public update for marking as used" 
ON public.access_codes 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public insert for creating codes" 
ON public.access_codes 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for user_profiles (users can only see their own)
CREATE POLICY "Users can read their own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to generate a random 12-character access code
CREATE OR REPLACE FUNCTION public.generate_access_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Create function to create access code
CREATE OR REPLACE FUNCTION public.create_access_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_code TEXT;
BEGIN
  new_code := generate_access_code();
  
  -- Ensure the code is unique
  WHILE EXISTS (SELECT 1 FROM public.access_codes WHERE code = new_code) LOOP
    new_code := generate_access_code();
  END LOOP;
  
  INSERT INTO public.access_codes (code) VALUES (new_code);
  RETURN new_code;
END;
$$;

-- Create function to validate access code
CREATE OR REPLACE FUNCTION public.validate_access_code(access_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.access_codes 
    WHERE code = access_code AND is_used = false
  );
END;
$$;

-- Create function to mark access code as used
CREATE OR REPLACE FUNCTION public.use_access_code(access_code TEXT, user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.access_codes 
  SET is_used = true, used_by = user_id, used_at = now()
  WHERE code = access_code AND is_used = false;
  
  RETURN FOUND;
END;
$$;