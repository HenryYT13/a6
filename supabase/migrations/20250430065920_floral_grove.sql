/*
  # Create timetable table

  1. New Tables
    - `timetable`
      - `id` (uuid, primary key)
      - `week` (text, references weeks.week_number)
      - `day` (integer, 2-8 for Monday-Sunday)
      - `period` (integer, 1-5)
      - `subject` (text)
      - `uniform` (text, one of: Áo Trắng, Áo Đỏ, Thể dục)

  2. Security
    - Enable RLS
    - Allow public read access
    - Allow admin to manage timetable
*/

CREATE TABLE IF NOT EXISTS timetable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week text REFERENCES weeks(week_number) ON DELETE CASCADE,
  day integer NOT NULL CHECK (day BETWEEN 2 AND 8),
  period integer NOT NULL CHECK (period BETWEEN 1 AND 5),
  subject text NOT NULL,
  uniform text NOT NULL CHECK (uniform IN ('Áo Trắng', 'Áo Đỏ', 'Thể dục')),
  UNIQUE(week, day, period)
);

ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can read timetable"
  ON timetable
  FOR SELECT
  TO public
  USING (true);

-- Allow admin to manage timetable
CREATE POLICY "Admin full access to timetable"
  ON timetable
  FOR ALL
  TO authenticated
  USING (auth.email() = 'quanly@a6quanly.lvt')
  WITH CHECK (auth.email() = 'quanly@a6quanly.lvt');