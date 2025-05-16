/*
  # Enable public access to weeks table
  
  1. Changes
    - Drop existing RLS policies for weeks table
    - Create new policy to allow all operations
    
  2. Security Note
    - This removes authentication requirements
    - Access control is now handled via secret URL parameter
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can insert weeks" ON weeks;
DROP POLICY IF EXISTS "Admins can update weeks" ON weeks;
DROP POLICY IF EXISTS "Admins can delete weeks" ON weeks;

-- Create a single policy that allows all operations
CREATE POLICY "Enable all operations for weeks"
ON weeks
FOR ALL
TO public
USING (true)
WITH CHECK (true);