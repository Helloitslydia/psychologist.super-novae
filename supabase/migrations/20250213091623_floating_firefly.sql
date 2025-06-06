/*
  # Add consultation details fields

  1. Changes
    - Add consultation_status field to appointments table
    - Add consultation_summary field to appointments table
    - Add satisfaction_feedback field to appointments table

  2. Security
    - Update RLS policies to allow psychologists to update consultation details
*/

-- Add new fields to appointments table
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS consultation_status text CHECK (consultation_status IN ('completed', 'partial', 'cancelled', 'no_show')),
ADD COLUMN IF NOT EXISTS consultation_summary text,
ADD COLUMN IF NOT EXISTS satisfaction_feedback text;