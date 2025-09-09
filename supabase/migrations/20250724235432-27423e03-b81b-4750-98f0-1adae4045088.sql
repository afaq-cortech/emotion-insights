-- Enable RLS on subscription_choices table if not already enabled
ALTER TABLE subscription_choices ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access to subscription choices
-- This is safe because subscription choices are public reference data
CREATE POLICY IF NOT EXISTS "Allow public read access to subscription choices" 
ON subscription_choices 
FOR SELECT 
USING (true);