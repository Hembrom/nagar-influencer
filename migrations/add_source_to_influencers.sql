-- Migration: Add source column to influencers table
-- Date: 2026-09-20
-- Description: Track whether influencer was self-registered or added by admin

-- Add source column (enum type) - only if it doesn't exist
ALTER TABLE influencers
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'self-registered' NOT NULL;

-- Add constraint to ensure only valid values (only if not already exists)
ALTER TABLE influencers
DROP CONSTRAINT IF EXISTS influencer_source_check;

ALTER TABLE influencers
ADD CONSTRAINT influencer_source_check 
CHECK (source IN ('self-registered', 'admin-added'));

-- Add index for faster filtering
CREATE INDEX IF NOT EXISTS idx_influencers_source ON influencers(source);

-- Update existing self-registered influencers (if you want to set them all as self-registered by default)
UPDATE influencers 
SET source = 'self-registered' 
WHERE source IS NULL;

-- Optional: If you have a created_by or created_at field to help determine source
-- UPDATE influencers 
-- SET source = 'admin-added' 
-- WHERE created_by IS NOT NULL AND created_by != 'system';
