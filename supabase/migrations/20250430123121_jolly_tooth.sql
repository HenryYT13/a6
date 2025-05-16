/*
  # Fix home_times RLS policies

  1. Changes
    - Drop existing RLS policies for home_times table
    - Create new policies that properly handle all operations including upsert
  
  2. Security
    - Enable RLS on home_times table
    - Add policies for:
      - Admin full access (including upsert operations)
      - Public read access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admin full access to home times" ON home_times;
DROP POLICY IF EXISTS "Enable read access for all users" ON home_times;

-- Create new policies
CREATE POLICY "Admin full access to home times"
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

CREATE POLICY "Enable read access for all users"
ON home_times
FOR SELECT
TO public
USING (true);