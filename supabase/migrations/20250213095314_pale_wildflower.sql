/*
  # Add satisfaction rating to appointments

  1. Changes
    - Add satisfaction_rating column to appointments table
      - Numeric field (1-10)
      - Optional field for storing satisfaction ratings
*/

-- Add satisfaction rating column
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS satisfaction_rating numeric
CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 10);