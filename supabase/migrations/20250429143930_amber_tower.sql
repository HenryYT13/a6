/*
  # Update submissions table policies

  1. Changes
    - Remove user_id requirement from submissions table
    - Update policies to allow anonymous submissions
    - Keep admin functionality intact
*/

-- Make user_id nullable
ALTER TABLE submissions ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own submissions" ON submissions;
DROP POLICY IF EXISTS "Users can read their own submissions" ON submissions;
DROP POLICY IF EXISTS "Admins can read all submissions" ON submissions;
DROP POLICY IF EXISTS "Admins can update submission status" ON submissions;

-- Create new policies
CREATE POLICY "Anyone can create submissions"
  ON submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read their own submissions"
  ON submissions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can update submissions"
  ON submissions
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