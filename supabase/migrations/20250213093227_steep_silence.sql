/*
  # Fix profile policies without NEW keyword

  1. Changes
    - Drop existing profile policies
    - Create new simplified policies
    - Fix insert policy to avoid using NEW keyword
    
  2. Security
    - Maintain proper access control
    - Allow psychologists to manage patient profiles
    - Allow users to manage their own profiles
*/

-- Drop all existing profile policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

-- Create new simplified policies
CREATE POLICY "allow_read_all_profiles"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "allow_insert_own_profile"
ON profiles FOR INSERT
WITH CHECK (
  auth.uid() = id
  OR (
    role = 'patient'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'psychologist'
    )
  )
);

CREATE POLICY "allow_update_profiles"
ON profiles FOR UPDATE
USING (
  auth.uid() = id
  OR (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'psychologist'
    )
    AND role = 'patient'
  )
);