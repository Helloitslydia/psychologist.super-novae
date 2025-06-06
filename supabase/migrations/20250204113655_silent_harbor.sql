/*
  # Fix column names and relationships

  1. Changes
    - Rename any camelCase columns to snake_case for consistency
    - Update queries to use correct relationship aliases
*/

-- Function to check if a column exists
CREATE OR REPLACE FUNCTION column_exists(
  p_table text,
  p_column text
) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = p_table
    AND column_name = p_column
  );
END;
$$ LANGUAGE plpgsql;

-- Rename columns if they exist in camelCase
DO $$ 
BEGIN
  IF column_exists('time_slots', 'startTime') THEN
    ALTER TABLE time_slots RENAME COLUMN "startTime" TO start_time;
  END IF;
  
  IF column_exists('time_slots', 'endTime') THEN
    ALTER TABLE time_slots RENAME COLUMN "endTime" TO end_time;
  END IF;
END $$;