-- Temporarily disable the foreign key constraint to insert sample data
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;

-- Create 100 sample user profiles with random demographic data
WITH sample_names AS (
  SELECT * FROM (VALUES
    ('John', 'Smith'), ('Jane', 'Johnson'), ('Michael', 'Williams'), ('Sarah', 'Brown'), ('David', 'Jones'),
    ('Emily', 'Garcia'), ('Christopher', 'Miller'), ('Jessica', 'Davis'), ('Matthew', 'Rodriguez'), ('Ashley', 'Martinez'),
    ('Joshua', 'Hernandez'), ('Amanda', 'Lopez'), ('Daniel', 'Gonzalez'), ('Stephanie', 'Wilson'), ('Andrew', 'Anderson'),
    ('Megan', 'Thomas'), ('Anthony', 'Taylor'), ('Lauren', 'Moore'), ('Kevin', 'Jackson'), ('Nicole', 'Martin'),
    ('Brian', 'Lee'), ('Jennifer', 'Perez'), ('Jason', 'Thompson'), ('Elizabeth', 'White'), ('Ryan', 'Harris'),
    ('Michelle', 'Sanchez'), ('Eric', 'Clark'), ('Amy', 'Ramirez'), ('Jacob', 'Lewis'), ('Angela', 'Robinson'),
    ('Nicholas', 'Walker'), ('Kimberly', 'Young'), ('Jonathan', 'Allen'), ('Lisa', 'King'), ('Tyler', 'Wright'),
    ('Mary', 'Scott'), ('Brandon', 'Torres'), ('Heather', 'Nguyen'), ('Zachary', 'Hill'), ('Samantha', 'Flores'),
    ('Adam', 'Green'), ('Rachel', 'Adams'), ('Nathan', 'Nelson'), ('Melissa', 'Baker'), ('James', 'Hall'),
    ('Laura', 'Rivera'), ('Justin', 'Campbell'), ('Crystal', 'Mitchell'), ('Robert', 'Carter'), ('Danielle', 'Roberts'),
    ('William', 'Gomez'), ('Brittany', 'Phillips'), ('Charles', 'Evans'), ('Kathryn', 'Turner'), ('Thomas', 'Diaz'),
    ('Rebecca', 'Parker'), ('Benjamin', 'Cruz'), ('Christina', 'Edwards'), ('Joseph', 'Collins'), ('Maria', 'Reyes'),
    ('Austin', 'Stewart'), ('Amanda', 'Morris'), ('Richard', 'Morales'), ('Kristen', 'Murphy'), ('Mark', 'Cook'),
    ('Katherine', 'Rogers'), ('Paul', 'Gutierrez'), ('Courtney', 'Ortiz'), ('Steven', 'Morgan'), ('Amber', 'Cooper'),
    ('Kenneth', 'Peterson'), ('Julie', 'Bailey'), ('Edward', 'Reed'), ('Vanessa', 'Kelly'), ('Timothy', 'Howard'),
    ('Lindsey', 'Ramos'), ('George', 'Kim'), ('Alicia', 'Cox'), ('Dennis', 'Ward'), ('Cassandra', 'Richardson'),
    ('Jeffrey', 'Watson'), ('Allison', 'Brooks'), ('Gregory', 'Chavez'), ('Tiffany', 'Wood'), ('Patrick', 'James'),
    ('Hannah', 'Bennett'), ('Peter', 'Gray'), ('Alexis', 'Mendoza'), ('Carl', 'Ruiz'), ('Kayla', 'Hughes'),
    ('Arthur', 'Price'), ('Monica', 'Alvarez'), ('Harold', 'Castillo'), ('Erica', 'Sanders'), ('Jordan', 'Patel'),
    ('Sara', 'Myers'), ('Ralph', 'Long'), ('Kelly', 'Ross'), ('Henry', 'Foster'), ('Andrea', 'Jimenez')
  ) AS names(first_name, last_name)
)
INSERT INTO user_profiles (
  user_id, first_name, last_name, email, cell_number, reactor_id, 
  subscription, reactor_level, gender, race, education, income, 
  marital_status, registered_voter, vote_2024, agree_iphone, 
  agree_live_id, agree_crosscheck, agree_data_share, status, 
  access_code, age_group
)
SELECT 
  gen_random_uuid() as user_id,
  first_name,
  last_name,
  first_name || '.' || last_name || '@email.com' as email,
  '+1' || LPAD(floor(random() * 9000000000 + 1000000000)::text, 10, '0') as cell_number,
  'R' || LPAD((1000 + row_number() OVER ())::text, 6, '0') as reactor_id,
  -- Random subscription
  (ARRAY['Free', 'Basic', 'Premium', 'Standard'])[floor(random() * 4 + 1)] as subscription,
  -- Random reactor level
  (ARRAY['Level 1', 'Level 2', 'Level 3'])[floor(random() * 3 + 1)] as reactor_level,
  -- Random gender from available options
  (ARRAY['Male', 'Female', 'Non-binary', 'Prefer not to say'])[floor(random() * 4 + 1)] as gender,
  -- Random race from available options
  (ARRAY['White', 'Black or African American', 'Hispanic or Latino', 'Asian', 'Native American', 'Other'])[floor(random() * 6 + 1)] as race,
  -- Random education from available options
  (ARRAY['High School', 'Some College', 'Associate Degree', 'Bachelor Degree', 'Master Degree', 'Doctorate'])[floor(random() * 6 + 1)] as education,
  -- Random income from available options
  (ARRAY['Under $25,000', '$25,000-$49,999', '$50,000-$74,999', '$75,000-$99,999', '$100,000-$149,999', '$150,000+'])[floor(random() * 6 + 1)] as income,
  -- Random marital status
  (ARRAY['Single', 'Married', 'Divorced', 'Widowed', 'Separated'])[floor(random() * 5 + 1)] as marital_status,
  -- Random registered voter
  (ARRAY['Yes', 'No'])[floor(random() * 2 + 1)] as registered_voter,
  -- Random vote 2024
  (ARRAY['Democrat', 'Republican', 'Independent', 'Other', 'Prefer not to say'])[floor(random() * 5 + 1)] as vote_2024,
  -- Random agreement fields
  (ARRAY['Yes', 'No'])[floor(random() * 2 + 1)] as agree_iphone,
  (ARRAY['Yes', 'No'])[floor(random() * 2 + 1)] as agree_live_id,
  (ARRAY['Yes', 'No'])[floor(random() * 2 + 1)] as agree_crosscheck,
  (ARRAY['Yes', 'No'])[floor(random() * 2 + 1)] as agree_data_share,
  'Panel Selection In Process' as status,
  -- Generate access code
  'AC' || LPAD(floor(random() * 999999)::text, 6, '0') as access_code,
  -- Random age group
  (ARRAY['18-24', '25-34', '35-44', '45-54', '55-64', '65+'])[floor(random() * 6 + 1)] as age_group
FROM sample_names
LIMIT 100;