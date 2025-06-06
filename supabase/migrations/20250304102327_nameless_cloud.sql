/*
  # Add public access to mental health resources

  1. Security
    - Add policy to allow public access to psychologist_content table
    - Add policy to allow public access to content_comments table
*/

-- Allow public to view all psychologist content
CREATE POLICY "Anyone can view psychologist content"
  ON psychologist_content
  FOR SELECT
  TO public
  USING (true);

-- Allow public to view all content comments
CREATE POLICY "Anyone can view content comments"
  ON content_comments
  FOR SELECT
  TO public
  USING (true);