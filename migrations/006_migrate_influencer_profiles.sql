-- Migration: Move existing influencer data from profiles to influencers table
-- This script transfers any influencer profiles already saved in the profiles table
-- to the dedicated influencers table for proper display in admin panel

-- Step 1: Insert any profiles with influencer_data into influencers table
INSERT INTO influencers (
  id,
  name,
  email,
  handle,
  bio,
  category,
  location,
  profile_photo,
  instagram_url,
  youtube_url,
  tiktok_url,
  audience_size,
  collaboration_interests,
  portfolio_links,
  source,
  status,
  created_at,
  updated_at,
  created_by
)
SELECT
  p.id,
  COALESCE((p.influencer_data->>'displayName')::text, p.full_name, 'Unknown Influencer'),
  p.email,
  LOWER(REPLACE(COALESCE((p.influencer_data->>'displayName')::text, p.full_name, 'unknown'), ' ', '_')),
  (p.influencer_data->>'bio')::text,
  (p.influencer_data->'categories'->0)::text,
  (p.influencer_data->>'location')::text,
  (p.influencer_data->>'profilePhoto')::text,
  (p.influencer_data->'socialLinks'->>'instagram')::text,
  (p.influencer_data->'socialLinks'->>'youtube')::text,
  (p.influencer_data->'socialLinks'->>'tiktok')::text,
  (p.influencer_data->>'audienceSize')::text,
  (SELECT STRING_AGG(value, ', ') FROM jsonb_array_elements_text(p.influencer_data->'collaborationInterests')),
  ARRAY(SELECT jsonb_array_elements_text(p.influencer_data->'portfolioLinks')),
  'self-registered',
  'verified',
  COALESCE((p.influencer_data->>'createdAt')::timestamp with time zone, p.created_at, NOW()),
  p.updated_at,
  p.id
FROM profiles p
WHERE p.influencer_data IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM influencers i WHERE i.id = p.id)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  handle = EXCLUDED.handle,
  bio = EXCLUDED.bio,
  category = EXCLUDED.category,
  location = EXCLUDED.location,
  profile_photo = EXCLUDED.profile_photo,
  instagram_url = EXCLUDED.instagram_url,
  youtube_url = EXCLUDED.youtube_url,
  tiktok_url = EXCLUDED.tiktok_url,
  audience_size = EXCLUDED.audience_size,
  collaboration_interests = EXCLUDED.collaboration_interests,
  portfolio_links = EXCLUDED.portfolio_links,
  updated_at = NOW();

-- Step 2: Log the migration result
-- Count how many influencers were migrated
SELECT COUNT(*) as migrated_influencers_count FROM influencers WHERE source = 'self-registered';
