/*
  # Fix home_times RLS policies

  1. Changes
    - Drop existing RLS policies for home_times table
    - Create new policies that properly handle admin access for all operations
    - Maintain public read access

  2. Security
    - Enable RLS on home_times table
    - Add policies for:
      - Admin full access (ALL operations)
      - Public read access (SELECT only)
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable admin full access" ON home_times;
DROP POLICY IF EXISTS "Enable read access for all users" ON home_times;

-- Create new policies
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

CREATE POLICY "Enable read access for all users"
ON home_times
FOR SELECT
TO public
USING (true);