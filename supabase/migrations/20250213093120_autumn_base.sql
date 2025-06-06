/*
  # Fix duplicate policies

  1. Changes
    - Drop existing policies by new names first
    - Recreate policies with proper checks
    - Ensure no naming conflicts
    
  2. Security
    - Maintain proper access control
    - Prevent unauthorized access
    - Ensure data isolation
*/

-- Drop policies by new names first to avoid conflicts
DROP POLICY IF EXISTS "Allow psychologists to view profiles" ON profiles;
DROP POLICY IF EXISTS "Allow psychologists to create patient profiles" ON profiles;
DROP POLICY IF EXISTS "Allow psychologists to update patient profiles" ON profiles;
DROP POLICY IF EXISTS "Allow psychologists to create appointments" ON appointments;

-- Drop old policies as well to ensure clean slate
DROP POLICY IF EXISTS "Psychologists can view patient profiles" ON profiles;
DROP POLICY IF EXISTS "Psychologists can create patient profiles" ON profiles;
DROP POLICY IF EXISTS "Psychologists can update patient profiles" ON profiles;
DROP POLICY IF EXISTS "Psychologists can create appointments for their time slots" ON appointments;

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