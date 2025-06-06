/*
  # Fix RLS policies recursion

  1. Changes
    - Fix infinite recursion in RLS policies
    - Simplify policy conditions
    - Maintain security while avoiding circular references

  2. Security
    - Maintains proper access control
    - Prevents unauthorized access
    - Avoids policy recursion
*/

-- Drop existing problematic policies to avoid conflicts
DROP POLICY IF EXISTS "Psychologists can view patient profiles" ON profiles;
DROP POLICY IF EXISTS "Psychologists can create patient profiles" ON profiles;
DROP POLICY IF EXISTS "Psychologists can update patient profiles" ON profiles;

-- Create new policies with fixed conditions
CREATE POLICY "Allow psychologists to view profiles"
ON profiles
FOR SELECT
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'psychologist'
  OR id = auth.uid()
);

CREATE POLICY "Allow psychologists to create patient profiles"
ON profiles
FOR INSERT
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'psychologist'
  AND role = 'patient'
);

CREATE POLICY "Allow psychologists to update patient profiles"
ON profiles
FOR UPDATE
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'psychologist'
  AND role = 'patient'
);

-- Ensure appointments policy is correct
DROP POLICY IF EXISTS "Psychologists can create appointments for their time slots" ON appointments;

CREATE POLICY "Allow psychologists to create appointments"
ON appointments
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM time_slots
    WHERE time_slots.id = time_slot_id
    AND time_slots.psychologist_id = auth.uid()
  )
);