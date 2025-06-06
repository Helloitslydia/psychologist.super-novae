/*
  # Fix RLS policies for manual appointments

  1. Changes
    - Fix policies to avoid using NEW keyword directly
    - Add policies for psychologists to manage patient profiles and appointments
    - Ensure proper role-based access control

  2. Security
    - Maintains existing RLS policies
    - Uses proper syntax for RLS policy conditions
    - Ensures data integrity with proper checks
*/

-- Allow psychologists to create patient profiles
CREATE POLICY "Psychologists can create patient profiles"
ON profiles
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'psychologist'
  )
  AND role = 'patient'
);

-- Allow psychologists to update patient profiles
CREATE POLICY "Psychologists can update patient profiles"
ON profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'psychologist'
  )
  AND role = 'patient'
);

-- Allow psychologists to create appointments for their time slots
CREATE POLICY "Psychologists can create appointments for their time slots"
ON appointments
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM time_slots
    WHERE time_slots.id = time_slot_id
    AND time_slots.psychologist_id = auth.uid()
  )
);

-- Allow psychologists to view all patient profiles
CREATE POLICY "Psychologists can view patient profiles"
ON profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'psychologist'
  )
  OR id = auth.uid()
);