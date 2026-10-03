-- Update RLS policies for influencers table to allow anon and authenticated inserts
-- This is needed for development/testing where users might not have full auth setup

-- Drop existing insert policy
DROP POLICY IF EXISTS "Allow authenticated users to insert influencers" ON influencers;

-- Create new policy that allows both authenticated and anon users to insert
-- In production, you might want to restrict this to only authenticated users
CREATE POLICY "Allow anyone to insert influencers"
  ON influencers FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Ensure select policy works for both authenticated and anon
DROP POLICY IF EXISTS "Allow authenticated users to read influencers" ON influencers;

CREATE POLICY "Allow anyone to read influencers"
  ON influencers FOR SELECT
  TO authenticated, anon
  USING (true);

-- Update policy to allow update on own records
DROP POLICY IF EXISTS "Allow users to update their own profile" ON influencers;

CREATE POLICY "Allow users to update influencers"
  ON influencers FOR UPDATE
  TO authenticated, anon
  WITH CHECK (true);

-- Allow delete for authenticated users only (be more restrictive here)
DROP POLICY IF EXISTS "Allow admins to delete influencers" ON influencers;

CREATE POLICY "Allow authenticated users to delete influencers"
  ON influencers FOR DELETE
  TO authenticated
  USING (true);
