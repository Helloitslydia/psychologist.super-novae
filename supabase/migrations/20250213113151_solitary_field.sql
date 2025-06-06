/*
  # Fix booking policies

  1. Changes
    - Drop existing appointment policies to avoid conflicts
    - Add more permissive policies for public appointment creation
    - Add policy for viewing appointments
    - Add policy for viewing time slots
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public to view time slots" ON time_slots;
DROP POLICY IF EXISTS "Allow public to view appointments" ON appointments;
DROP POLICY IF EXISTS "Allow public to create appointments" ON appointments;

-- Allow anyone to view available time slots
CREATE POLICY "Anyone can view time slots"
ON time_slots
FOR SELECT
USING (true);

-- Allow anyone to create appointments with patient info
CREATE POLICY "Anyone can create appointments with patient info"
ON appointments
FOR INSERT
WITH CHECK (
  patient_first_name IS NOT NULL
  AND patient_whatsapp IS NOT NULL
  AND status = 'confirmed'
);

-- Allow viewing appointments by patient info
CREATE POLICY "View appointments by patient info"
ON appointments
FOR SELECT
USING (
  patient_first_name IS NOT NULL
  AND patient_whatsapp IS NOT NULL
);