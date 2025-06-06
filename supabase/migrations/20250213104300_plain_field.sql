/*
  # Add biweekly reports table

  1. New Tables
    - `biweekly_reports`
      - `id` (uuid, primary key)
      - `psychologist_id` (uuid, references psychologists)
      - `content` (text, report content)
      - `period_start` (date, start of the reporting period)
      - `period_end` (date, end of the reporting period)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `biweekly_reports` table
    - Add policies for psychologists to manage their own reports
    - Add policy for psychologists to read their own reports
*/

-- Create biweekly reports table
CREATE TABLE IF NOT EXISTS biweekly_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id uuid NOT NULL REFERENCES psychologists(id),
  content text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_period CHECK (period_end >= period_start)
);

-- Enable RLS
ALTER TABLE biweekly_reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Psychologists can manage their own reports"
  ON biweekly_reports
  FOR ALL
  USING (auth.uid() = psychologist_id)
  WITH CHECK (auth.uid() = psychologist_id);

-- Create index for better performance
CREATE INDEX idx_biweekly_reports_psychologist_id_period 
ON biweekly_reports(psychologist_id, period_start, period_end);