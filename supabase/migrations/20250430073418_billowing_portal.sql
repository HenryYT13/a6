/*
  # Create home times table

  1. New Tables
    - `home_times`
      - `id` (uuid, primary key)
      - `week` (text, references weeks.week_number)
      - `day` (integer, 2-8 for Monday-Sunday)
      - `morning_time` (text)
      - `afternoon_time` (text)

  2. Security
    - Enable RLS
    - Allow public read access
    - Allow admin to manage home times
*/

CREATE TABLE IF NOT EXISTS home_times (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week text REFERENCES weeks(week_number) ON DELETE CASCADE,
  day integer NOT NULL CHECK (day BETWEEN 2 AND 8),
  morning_time text NOT NULL DEFAULT '11:30',
  afternoon_time text NOT NULL DEFAULT '17:00',
  UNIQUE(week, day)
);

ALTER TABLE home_times ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can read home times"
  ON home_times
  FOR SELECT
  TO public
  USING (true);

-- Allow admin to manage home times
CREATE POLICY "Admin full access to home times"
  ON home_times
  FOR ALL
  TO authenticated
  USING (auth.email() = 'quanly@a6quanly.lvt')
  WITH CHECK (auth.email() = 'quanly@a6quanly.lvt');