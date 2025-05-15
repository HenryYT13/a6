/*
  # Create weeks table for managing available weeks

  1. New Tables
    - `weeks`
      - `id` (uuid, primary key)
      - `week_number` (text, unique)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `weeks` table
    - Add policy for public to read weeks
    - Add policy for admins to manage weeks
*/

CREATE TABLE IF NOT EXISTS weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;

-- Allow public to read weeks
CREATE POLICY "Anyone can read weeks"
  ON weeks
  FOR SELECT
  TO public
  USING (true);

-- Allow admins to manage weeks
CREATE POLICY "Admins can manage weeks"
  ON weeks
  FOR ALL
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

-- Insert initial weeks
INSERT INTO weeks (week_number)
VALUES ('33'), ('34'), ('35')
ON CONFLICT (week_number) DO NOTHING;