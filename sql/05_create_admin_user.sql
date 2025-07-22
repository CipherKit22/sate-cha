-- Create Admin User Script
-- This script updates the user with email tayzarminhtay34@gmail.com to have admin role

-- Update user role to admin for the specified email
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'::jsonb
)
WHERE email = 'tayzarminhtay34@gmail.com';

-- Also update the user_profiles table if it exists
UPDATE user_profiles 
SET role = 'admin'
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'tayzarminhtay34@gmail.com'
);

-- Verify the update
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users 
WHERE email = 'tayzarminhtay34@gmail.com';

-- Note: Run this script after the user has signed up with the email tayzarminhtay34@gmail.com
