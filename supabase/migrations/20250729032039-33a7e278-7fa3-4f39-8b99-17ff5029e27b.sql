-- Update the newly created records to remove access_code and ensure status is correct
UPDATE user_profiles 
SET 
  access_code = NULL,
  status = 'Panel Selection In Process'
WHERE reactor_id LIKE 'R0010%' AND reactor_id >= 'R001001' AND reactor_id <= 'R001100';