-- Update influencers table to allow NULL for optional fields
-- This ensures we can insert records even if some data is missing

-- Make bio nullable (it was TEXT without NOT NULL, so it should be fine)
-- Make followers nullable if not already
ALTER TABLE influencers
  ALTER COLUMN followers DROP NOT NULL;

-- Make sure portfolio_links has a proper default
ALTER TABLE influencers
  ALTER COLUMN portfolio_links SET DEFAULT ARRAY[]::TEXT[];

-- Add missing index on updated_at for sorting/filtering
CREATE INDEX IF NOT EXISTS idx_influencers_updated_at ON influencers(updated_at DESC);

-- Add unique constraint on email (if not already there)
-- This will help prevent duplicate registrations
ALTER TABLE influencers
  ADD CONSTRAINT influencers_email_unique UNIQUE (email) WHERE deleted_at IS NULL;

-- Note: The above might fail if email unique constraint already exists - that's OK
