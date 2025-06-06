/*
  # Add patient info fields to appointments table
  
  1. Changes
    - Add first_name column to store patient's first name
    - Add whatsapp_number column to store patient's WhatsApp number
    
  2. Notes
    - These fields are used for manual appointments without patient profiles
*/

-- Add new columns for patient info
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS patient_first_name text,
ADD COLUMN IF NOT EXISTS patient_whatsapp text;