/*
  # Add file support to psychologist content

  1. Changes
    - Add file_url and file_type columns to psychologist_content table
    - Remove existing URL constraint
    - Add new constraint to ensure either URL or file is provided
    - Create storage bucket and policies for content files

  2. Security
    - Enable public access to view files
    - Restrict file uploads to authenticated users
*/

-- First drop the existing constraint if it exists
DO $$ 
BEGIN
  ALTER TABLE psychologist_content DROP CONSTRAINT IF EXISTS valid_url;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add new columns for file support
ALTER TABLE psychologist_content
ADD COLUMN IF NOT EXISTS file_url text,
ADD COLUMN IF NOT EXISTS file_type text;

-- Add constraint to ensure file_type is either pdf or image when file_url is present
ALTER TABLE psychologist_content
ADD CONSTRAINT valid_file_type 
CHECK (file_type IS NULL OR file_type IN ('pdf', 'image'));

-- Add constraint to ensure either URL or file is provided, but not both
ALTER TABLE psychologist_content
ADD CONSTRAINT valid_content 
CHECK (
  (url IS NULL AND file_url IS NOT NULL AND file_type IS NOT NULL) OR
  (url IS NOT NULL AND file_url IS NULL AND file_type IS NULL) OR
  (url IS NULL AND file_url IS NULL AND file_type IS NULL)
);

-- Add constraint for valid URLs when URL is provided
ALTER TABLE psychologist_content
ADD CONSTRAINT valid_url 
CHECK (url IS NULL OR url ~ '^https?://.+');

-- Create storage bucket for content files if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-files', 'content-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload content files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'content-files' AND
  (storage.foldername(name))[1] = 'psychologist-content'
);

CREATE POLICY "Anyone can view content files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'content-files');