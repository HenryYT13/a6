/*
  # Fix home_times RLS policies

  1. Changes
    - Drop existing RLS policies for home_times table
    - Create new comprehensive RLS policies that properly handle all operations including upserts
  
  2. Security
    - Maintain admin-only write access
    - Keep public read access
    - Ensure upsert operations work correctly with RLS
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admin full access to home times" ON home_times;
DROP POLICY IF EXISTS "Anyone can read home times" ON home_times;

-- Create new policies
CREATE POLICY "Enable read access for everyone"
ON home_times
FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable admin full access"
ON home_times
AS PERMISSIVE
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