/*
  # Create users and submissions tables with policies

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `is_admin` (boolean)
    - `submissions`
      - `id` (uuid, primary key)
      - `submitter_name` (text)
      - `type` (text)
      - `week` (text)
      - `person_name` (text)
      - `notes` (text, optional)
      - `status` (text, defaults to 'pending')
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on both tables
    - Add policies for user and admin access
*/

-- Create users table first
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  is_admin boolean DEFAULT false
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitter_name text NOT NULL,
  type text NOT NULL,
  week text NOT NULL,
  person_name text NOT NULL,
  notes text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  -- Basic user policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'submissions' 
    AND policyname = 'Users can create their own submissions'
  ) THEN
    CREATE POLICY "Users can create their own submissions"
      ON submissions
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'submissions' 
    AND policyname = 'Users can read their own submissions'
  ) THEN
    CREATE POLICY "Users can read their own submissions"
      ON submissions
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Admin policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'submissions' 
    AND policyname = 'Admins can read all submissions'
  ) THEN
    CREATE POLICY "Admins can read all submissions"
      ON submissions
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid()
          AND users.is_admin = true
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'submissions' 
    AND policyname = 'Admins can update submission status'
  ) THEN
    CREATE POLICY "Admins can update submission status"
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
  END IF;
END $$;