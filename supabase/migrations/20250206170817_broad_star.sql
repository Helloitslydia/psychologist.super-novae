/*
  # Add photo and languages support

  1. Changes
    - Add `languages` column to psychologists table
    - Create storage bucket for photos
    - Add storage policies

  2. Security
    - Enable RLS for storage bucket
    - Add policies for authenticated users to manage their photos
*/

-- Add languages column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'psychologists' AND column_name = 'languages'
  ) THEN
    ALTER TABLE psychologists 
    ADD COLUMN languages text[] DEFAULT ARRAY['fr']::text[];
  END IF;
END $$;

-- Create storage bucket for photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'photos' AND
  (storage.foldername(name))[1] = 'psychologist-photos'
);

CREATE POLICY "Authenticated users can update their photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'photos' AND
  (storage.foldername(name))[1] = 'psychologist-photos'
);

CREATE POLICY "Anyone can view photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'photos');

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_psychologists_languages 
ON psychologists USING gin (languages);