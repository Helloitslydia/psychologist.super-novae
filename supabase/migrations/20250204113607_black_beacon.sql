/*
  # Add insert policies for profiles and psychologists

  1. Changes
    - Add policy to allow users to insert their own profile
    - Add policy to allow psychologists to insert their own profile record

  2. Security
    - Maintains RLS by ensuring users can only create their own records
    - Uses auth.uid() to verify user identity
*/

-- Add insert policy for profiles
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Add insert policy for psychologists
CREATE POLICY "Psychologists can insert their own profile"
  ON psychologists FOR INSERT
  WITH CHECK (auth.uid() = id);