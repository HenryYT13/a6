/*
  # Fix weeks table RLS policies

  1. Changes
    - Drop existing ALL policy that's too broad
    - Create specific policies for each operation type (INSERT, UPDATE, DELETE)
    - Keep existing SELECT policy unchanged
  
  2. Security
    - Ensure only admin users can manage weeks
    - Maintain public read access
*/

-- Drop the existing broad policy
DROP POLICY IF EXISTS "Admins can manage weeks" ON weeks;

-- Create specific policies for each operation
CREATE POLICY "Admins can insert weeks"
ON weeks
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  )
);

CREATE POLICY "Admins can update weeks"
ON weeks
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  )
);

CREATE POLICY "Admins can delete weeks"
ON weeks
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  )
);