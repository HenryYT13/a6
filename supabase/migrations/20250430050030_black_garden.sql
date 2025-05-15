/*
  # Fix admin access and permissions

  1. Changes
    - Ensure admin user has correct permissions
    - Update policies for admin access
    - Clean up existing policies
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins have full access" ON users;
DROP POLICY IF EXISTS "Admins have full access to weeks" ON weeks;
DROP POLICY IF EXISTS "Admins have full access to submissions" ON submissions;
DROP POLICY IF EXISTS "Admins have full access to subjects" ON subjects;
DROP POLICY IF EXISTS "Admins have full access to schedule" ON schedule;

-- Create new admin policies with simplified checks
CREATE POLICY "Admin full access"
  ON users
  FOR ALL
  TO authenticated
  USING (auth.email() = 'quanly@a6quanly.lvt')
  WITH CHECK (auth.email() = 'quanly@a6quanly.lvt');

CREATE POLICY "Admin full access to weeks"
  ON weeks
  FOR ALL
  TO authenticated
  USING (auth.email() = 'quanly@a6quanly.lvt')
  WITH CHECK (auth.email() = 'quanly@a6quanly.lvt');

CREATE POLICY "Admin full access to submissions"
  ON submissions
  FOR ALL
  TO authenticated
  USING (auth.email() = 'quanly@a6quanly.lvt')
  WITH CHECK (auth.email() = 'quanly@a6quanly.lvt');

CREATE POLICY "Admin full access to subjects"
  ON subjects
  FOR ALL
  TO authenticated
  USING (auth.email() = 'quanly@a6quanly.lvt')
  WITH CHECK (auth.email() = 'quanly@a6quanly.lvt');

CREATE POLICY "Admin full access to schedule"
  ON schedule
  FOR ALL
  TO authenticated
  USING (auth.email() = 'quanly@a6quanly.lvt')
  WITH CHECK (auth.email() = 'quanly@a6quanly.lvt');

-- Set admin flag for the admin user
INSERT INTO users (id, is_admin)
SELECT id, true
FROM auth.users
WHERE email = 'quanly@a6quanly.lvt'
ON CONFLICT (id) DO UPDATE
SET is_admin = true;