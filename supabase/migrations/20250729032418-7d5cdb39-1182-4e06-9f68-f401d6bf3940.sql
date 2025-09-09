-- Ensure all user_profiles have reactor_id and correct status
-- First, update all records to have the correct status
UPDATE user_profiles 
SET status = 'Panel Selection In Process'
WHERE status IS NULL OR status != 'Panel Selection In Process';

-- Then, assign reactor_ids to any records that don't have one using a simpler approach
WITH missing_reactor_ids AS (
  SELECT 
    id,
    1001000 + row_number() OVER (ORDER BY created_at) as new_reactor_num
  FROM user_profiles 
  WHERE reactor_id IS NULL OR reactor_id = ''
)
UPDATE user_profiles 
SET reactor_id = 'R' || LPAD(missing_reactor_ids.new_reactor_num::text, 6, '0')
FROM missing_reactor_ids
WHERE user_profiles.id = missing_reactor_ids.id;