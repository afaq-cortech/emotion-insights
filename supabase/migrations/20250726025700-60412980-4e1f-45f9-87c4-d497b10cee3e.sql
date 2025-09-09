-- Add RLS policy to allow read access to reactor_status table
CREATE POLICY "Allow public read access to reactor_status" 
ON reactor_status 
FOR SELECT 
USING (true);