/*
  # Fix duplicate policies for public access

  1. Changes
    - Drop existing policies if they exist
    - Recreate policies for public access to content and comments
    
  2. Security
    - Maintains public read access to content
    - Ensures no duplicate policies
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view psychologist content" ON psychologist_content;
DROP POLICY IF EXISTS "Anyone can view content comments" ON content_comments;

-- Recreate policies
CREATE POLICY "Anyone can view psychologist content"
  ON psychologist_content
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view content comments"
  ON content_comments
  FOR SELECT
  TO public
  USING (true);