-- Add level_desc column to reactor_warnings table
ALTER TABLE public.reactor_warnings 
ADD COLUMN IF NOT EXISTS level_desc TEXT;