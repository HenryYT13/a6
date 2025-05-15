/*
  # Fix notifications table RLS policies

  1. Changes
    - Update RLS policies for notifications table
    - Allow admin users to manage notifications
    - Allow public read access
    
  2. Security
    - Enable RLS
    - Add policies for admin access and public read
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin full access to notifications" ON notifications;
DROP POLICY IF EXISTS "Enable read access for all users" ON notifications;

-- Create new policies
CREATE POLICY "Admin full access to notifications"
ON notifications
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND (users.is_admin = true OR auth.email() = 'quanly@a6quanly.lvt'::text)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND (users.is_admin = true OR auth.email() = 'quanly@a6quanly.lvt'::text)
  )
);

CREATE POLICY "Enable read access for all users"
ON notifications
FOR SELECT
TO public
USING (true);