/*
  # Make patient_id nullable in appointments table
  
  1. Changes
    - Modify appointments table to make patient_id column nullable
    - This allows creating appointments without a patient reference
    
  2. Security
    - Existing RLS policies remain unchanged
*/

ALTER TABLE appointments
ALTER COLUMN patient_id DROP NOT NULL;