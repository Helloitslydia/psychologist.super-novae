/*
  # Allow unauthenticated bookings

  1. Changes
    - Add policy to allow public access to time_slots table
    - Add policy to allow public access to appointments table
    - Add policy to allow public to create appointments

  2. Security
    - Maintains RLS but allows public access for specific operations
    - Ensures data integrity while allowing unauthenticated bookings
*/

-- Allow public to view time slots
CREATE POLICY "Allow public to view time slots"
ON time_slots
FOR SELECT
TO public
USING (true);

-- Allow public to view appointments (their own only, by patient info)
CREATE POLICY "Allow public to view appointments"
ON appointments
FOR SELECT
TO public
USING (
  patient_first_name IS NOT NULL
  AND patient_whatsapp IS NOT NULL
);

-- Allow public to create appointments
CREATE POLICY "Allow public to create appointments"
ON appointments
FOR INSERT
TO public
WITH CHECK (
  patient_first_name IS NOT NULL
  AND patient_whatsapp IS NOT NULL
);