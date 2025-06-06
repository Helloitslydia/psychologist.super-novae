/*
  # Add satisfaction rating column

  1. Changes
    - Add satisfaction_rating column to appointments table with a 1-5 scale
    - Update check constraint to ensure rating is between 1 and 5
    - Drop old satisfaction_rating column if it exists

  2. Notes
    - Rating scale is 1-5 stars
    - NULL value indicates no rating
*/

-- First drop the existing column if it exists (with its check constraint)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' 
    AND column_name = 'satisfaction_rating'
  ) THEN
    ALTER TABLE appointments DROP COLUMN satisfaction_rating;
  END IF;
END $$;

-- Add new satisfaction_rating column with 1-5 scale
ALTER TABLE appointments
ADD COLUMN satisfaction_rating numeric
CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5);