/*
  # Create notifications table

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `week` (text, references weeks.week_number)
      - `day` (integer, 2-8 for Monday-Sunday)
      - `hour` (text)
      - `content` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Allow public read access
    - Allow admin to manage notifications
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week text REFERENCES weeks(week_number) ON DELETE CASCADE,
  day integer NOT NULL CHECK (day BETWEEN 2 AND 8),
  hour text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(week, day, hour)
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Enable read access for all users"
  ON notifications
  FOR SELECT
  TO public
  USING (true);

-- Allow admin to manage notifications
CREATE POLICY "Admin full access to notifications"
  ON notifications
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