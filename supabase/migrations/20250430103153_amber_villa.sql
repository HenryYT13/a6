/*
  # Fix home times permissions and policies

  1. Changes
    - Drop existing policies
    - Create new comprehensive policies for admin access
    - Allow public read access
    - Fix upsert operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON home_times;
DROP POLICY IF EXISTS "Enable admin full access" ON home_times;

-- Create new policies
CREATE POLICY "Enable read access for all users"
  ON home_times
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin full access to home times"
  ON home_times
  FOR ALL
  TO authenticated
  USING (EXISTS ( SELECT 1
    FROM users
    WHERE users.id = auth.uid()
    AND (users.is_admin = true OR auth.email() = 'quanly@a6quanly.lvt'::text)
  ))
  WITH CHECK (EXISTS ( SELECT 1
    FROM users
    WHERE users.id = auth.uid()
    AND (users.is_admin = true OR auth.email() = 'quanly@a6quanly.lvt'::text)
  ));