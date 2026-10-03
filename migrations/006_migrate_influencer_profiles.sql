-- Migration: Move existing influencer data from profiles to influencers table
-- This script transfers any influencer profiles already saved in the profiles table
-- to the dedicated influencers table for proper display in admin panel

-- Step 1: Insert any profiles with influencer_data into influencers table
-- Note: We let the DB auto-generate IDs and use email as unique constraint
INSERT INTO influencers (
  name,
  email,
  handle,
  bio,
  location,
  profile_photo,
  category,
  instagram_url,
  youtube_url,
  tiktok_url,
  audience_size,
  collaboration_interests,
  portfolio_links,
  source,
  status,
  created_at,
  updated_at
)
SELECT
  COALESCE((p.influencer_data->>'displayName')::text, p.full_name, 'Unknown Influencer') as name,
  COALESCE(p.email, 'influencer-' || p.id::text || '@growmyinfluence.in') as email,
  LOWER(REGEXP_REPLACE(
    COALESCE((p.influencer_data->>'displayName')::text, p.full_name, 'user'),
    '\s+',
    '_',
    'g'
  )) as handle,
  (p.influencer_data->>'bio')::text as bio,
  (p.influencer_data->>'location')::text as location,
  (p.influencer_data->>'profilePhoto')::text as profile_photo,
  COALESCE((p.influencer_data->'categories'->>0)::text, 'Other') as category,
  (p.influencer_data->'socialLinks'->>'instagram')::text as instagram_url,
  (p.influencer_data->'socialLinks'->>'youtube')::text as youtube_url,
  (p.influencer_data->'socialLinks'->>'tiktok')::text as tiktok_url,
  (p.influencer_data->>'audienceSize')::text as audience_size,
  (SELECT STRING_AGG(value::text, ', ')
   FROM jsonb_array_elements(
     COALESCE(p.influencer_data->'collaborationInterests', '[]'::jsonb)
   )) as collaboration_interests,
  (SELECT ARRAY_AGG(value::text)
   FROM jsonb_array_elements(
     COALESCE(p.influencer_data->'portfolioLinks', '[]'::jsonb)
   )) as portfolio_links,
  'self-registered' as source,
  'verified' as status,
  COALESCE((p.influencer_data->>'createdAt')::timestamp with time zone, p.created_at, NOW()) as created_at,
  NOW() as updated_at
FROM profiles p
WHERE p.influencer_data IS NOT NULL
  AND p.influencer_data != 'null'::jsonb
  AND p.email IS NOT NULL
ON CONFLICT (email) DO UPDATE SET
  -- If email already exists in influencers, update with latest data
  name = EXCLUDED.name,
  handle = EXCLUDED.handle,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  profile_photo = EXCLUDED.profile_photo,
  category = EXCLUDED.category,
  instagram_url = EXCLUDED.instagram_url,
  youtube_url = EXCLUDED.youtube_url,
  tiktok_url = EXCLUDED.tiktok_url,
  audience_size = EXCLUDED.audience_size,
  collaboration_interests = EXCLUDED.collaboration_interests,
  portfolio_links = EXCLUDED.portfolio_links,
  updated_at = NOW();

-- Step 2: Show migration results
SELECT 
  COUNT(*) as total_influencers,
  COUNT(CASE WHEN source = 'self-registered' THEN 1 END) as self_registered,
  COUNT(CASE WHEN source = 'admin-added' THEN 1 END) as admin_added,
  COUNT(CASE WHEN status = 'verified' THEN 1 END) as verified
FROM influencers;
