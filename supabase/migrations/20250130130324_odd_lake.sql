/*
  # Create Test User

  1. Creates a test user for development purposes
  2. Sets up initial authentication
*/

-- Create a test user (the password is 'test123456')
INSERT INTO auth.users (
  instance_id,
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'test@example.com',
  crypt('test123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
);