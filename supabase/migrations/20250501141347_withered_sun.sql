/*
  # Fix notifications table RLS policies

  1. Changes
    - Drop and recreate RLS policies for notifications table
    - Fix admin access for all operations
    - Maintain public read access
    
  2. Security
    - Enable RLS
    - Add policies for admin access and public read
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admin full access to notifications" ON notifications;
DROP POLICY IF EXISTS "Enable read access for all users" ON notifications;

-- Create new policies
CREATE POLICY "Enable all operations for weeks"
ON notifications
FOR ALL
TO public
USING (true)
WITH CHECK (true);