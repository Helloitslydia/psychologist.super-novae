/*
  # Add psychologist content table

  1. New Tables
    - `psychologist_content`
      - `id` (uuid, primary key)
      - `psychologist_id` (uuid, foreign key to psychologists)
      - `title` (text)
      - `description` (text)
      - `url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `psychologist_content` table
    - Add policy for psychologists to manage their own content
*/

-- Drop existing table and policies if they exist
DROP TABLE IF EXISTS psychologist_content CASCADE;

-- Create psychologist content table
CREATE TABLE psychologist_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id uuid NOT NULL REFERENCES psychologists(id),
  title text NOT NULL,
  description text,
  url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_url CHECK (url ~ '^https?://.+')
);

-- Enable RLS
ALTER TABLE psychologist_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "manage_own_content"
  ON psychologist_content
  FOR ALL
  USING (auth.uid() = psychologist_id)
  WITH CHECK (auth.uid() = psychologist_id);

-- Create index for better performance
CREATE INDEX idx_psychologist_content_psychologist_id 
ON psychologist_content(psychologist_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_psychologist_content_updated_at
  BEFORE UPDATE
  ON psychologist_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();