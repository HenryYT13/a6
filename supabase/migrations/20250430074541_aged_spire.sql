/*
  # Fix timetable RLS policies

  1. Changes
    - Drop existing RLS policies
    - Add new policy to allow all operations
    - Maintain consistency with weeks table access pattern
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read timetable" ON timetable;
DROP POLICY IF EXISTS "Admin full access to timetable" ON timetable;

-- Create new policy allowing all operations
CREATE POLICY "Enable all operations for timetable"
ON timetable
FOR ALL
TO public
USING (true)
WITH CHECK (true);