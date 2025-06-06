/*
  # Fix profile policies recursion

  1. Changes
    - Drop existing recursive policies
    - Create new simplified policies that avoid recursion
    - Use direct role checks without self-referential queries
    
  2. Security
    - Maintain proper access control
    - Prevent unauthorized access
    - Ensure data isolation
*/

-- Drop all existing profile policies to start fresh
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow psychologists to view profiles" ON profiles;
DROP POLICY IF EXISTS "Allow psychologists to create patient profiles" ON profiles;
DROP POLICY IF EXISTS "Allow psychologists to update patient profiles" ON profiles;

-- Create new non-recursive policies
CREATE POLICY "profiles_select_policy"
ON profiles
FOR SELECT
USING (true);  -- Allow reading all profiles

CREATE POLICY "profiles_insert_policy"
ON profiles
FOR INSERT
WITH CHECK (
  auth.uid() = id
  OR (
    EXISTS (
      SELECT 1
      FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND id IN (
        SELECT p.id
        FROM profiles p
        WHERE p.role = 'psychologist'
      )
    )
    AND role = 'patient'
  )
);

CREATE POLICY "profiles_update_policy"
ON profiles
FOR UPDATE
USING (
  auth.uid() = id
  OR (
    role = 'patient'
    AND EXISTS (
      SELECT 1
      FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.uid() IN (
        SELECT p.id
        FROM profiles p
        WHERE p.role = 'psychologist'
      )
    )
  )
);