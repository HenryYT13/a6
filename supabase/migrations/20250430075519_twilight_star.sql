/*
  # Fix home times RLS policies

  1. Changes
    - Drop existing policies
    - Create new policy for admin access
    - Allow all operations for authenticated admin users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admin full access to home times" ON home_times;
DROP POLICY IF EXISTS "Enable admin full access" ON home_times;

-- Create new policy for admin access
CREATE POLICY "Enable admin full access"
  ON home_times
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.is_admin = true OR auth.email() = 'quanly@a6quanly.lvt')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.is_admin = true OR auth.email() = 'quanly@a6quanly.lvt')
    )
  );