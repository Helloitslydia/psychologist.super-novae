/*
  # Add comment moderation system

  1. Changes
    - Add status column to content_comments table
    - Update RLS policies for comment visibility
    - Add moderation policies for psychologists

  2. Security
    - Only approved comments are publicly visible
    - Psychologists can see and moderate all comments
*/

-- Add status column to content_comments
ALTER TABLE content_comments
ADD COLUMN status text NOT NULL DEFAULT 'pending'
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read comments" ON content_comments;
DROP POLICY IF EXISTS "Anyone can create comments" ON content_comments;

-- Create new policies
CREATE POLICY "Public can only see approved comments"
ON content_comments
FOR SELECT
TO public
USING (status = 'approved');

CREATE POLICY "Psychologists can see all comments"
ON content_comments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'psychologist'
  )
);

CREATE POLICY "Anyone can create pending comments"
ON content_comments
FOR INSERT
TO public
WITH CHECK (status = 'pending');

CREATE POLICY "Psychologists can moderate comments"
ON content_comments
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'psychologist'
  )
)
WITH CHECK (status IN ('approved', 'rejected'));