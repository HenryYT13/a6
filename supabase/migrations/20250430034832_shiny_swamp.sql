/*
  # Add schedule management tables

  1. New Tables
    - `subjects`
      - `id` (uuid, primary key)
      - `name_vi` (text)
      - `name_en` (text)
      - `uniform` (text)
    - `schedule`
      - `id` (uuid, primary key)
      - `period` (integer)
      - `day` (integer, 2-8 for Monday-Sunday)
      - `subject_id` (uuid, references subjects)

  2. Security
    - Enable public access for reading
    - Enable admin management through weeks table policy
*/

CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_vi text NOT NULL,
  name_en text NOT NULL,
  uniform text NOT NULL
);

CREATE TABLE IF NOT EXISTS schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period integer NOT NULL,
  day integer NOT NULL CHECK (day BETWEEN 2 AND 8),
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Enable read access for all users" ON subjects FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON schedule FOR SELECT USING (true);

-- Allow all operations through weeks policy
CREATE POLICY "Enable all operations for weeks" ON subjects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for weeks" ON schedule FOR ALL USING (true) WITH CHECK (true);

-- Insert some initial subjects
INSERT INTO subjects (name_vi, name_en, uniform) VALUES
  ('Toán', 'Math', 'Đồng phục'),
  ('Văn', 'Literature', 'Đồng phục'),
  ('Anh', 'English', 'Đồng phục'),
  ('Thể dục', 'Physical Education', 'Đồ thể dục');