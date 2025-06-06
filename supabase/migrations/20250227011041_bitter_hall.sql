/*
  # Add comments for mental health resources

  1. New Tables
    - `content_comments`
      - `id` (uuid, primary key)
      - `content_id` (uuid, references psychologist_content)
      - `author_name` (text)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `content_comments` table
    - Add policy for public to read comments
    - Add policy for public to create comments
*/

-- Create content comments table
CREATE TABLE IF NOT EXISTS content_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES psychologist_content(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read comments"
  ON content_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create comments"
  ON content_comments
  FOR INSERT
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_content_comments_content_id 
ON content_comments(content_id);