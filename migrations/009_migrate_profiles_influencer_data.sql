-- Migration: Extract influencer_data from profiles JSON and insert into influencers table
-- Purpose: Move existing influencer profiles from profiles.influencer_data JSON to dedicated influencers table rows

WITH profile_data AS (
  SELECT
    -- Extract display name from JSON
    COALESCE(
      (influencer_data ->> 'displayName')::text,
      full_name,
      'Influencer'
    ) as name,
    email,
    -- Generate base handle from display name
    LOWER(REGEXP_REPLACE(
      COALESCE((influencer_data ->> 'displayName')::text, full_name, 'influencer'),
      '[^a-zA-Z0-9_]',
      '_',
      'g'
    )) as base_handle,
    (influencer_data ->> 'bio')::text as bio,
    (influencer_data ->> 'location')::text as location,
    CASE 
      -- Don't use base64 data URIs for profile photos
      WHEN (influencer_data ->> 'profilePhoto')::text LIKE 'data:%' THEN NULL
      ELSE (influencer_data ->> 'profilePhoto')::text
    END as profile_photo,
    -- Extract first category or default to 'Other'
    COALESCE(
      ((influencer_data -> 'categories') ->> 0)::text,
      'Other'
    ) as category,
    ((influencer_data -> 'socialLinks') ->> 'instagram')::text as instagram_url,
    ((influencer_data -> 'socialLinks') ->> 'youtube')::text as youtube_url,
    ((influencer_data -> 'socialLinks') ->> 'tiktok')::text as tiktok_url,
    NULLIF((influencer_data ->> 'audienceSize')::text, '') as audience_size,
    CASE 
      WHEN influencer_data -> 'categories' IS NOT NULL 
      THEN ARRAY_TO_STRING(
        ARRAY(SELECT jsonb_array_elements_text(influencer_data -> 'categories')),
        ', '
      )
      ELSE NULL
    END as collaboration_interests,
    CASE
      WHEN influencer_data -> 'portfolioLinks' IS NOT NULL
      THEN ARRAY(SELECT jsonb_array_elements_text(influencer_data -> 'portfolioLinks'))::text[]
      ELSE NULL
    END as portfolio_links,
    COALESCE((influencer_data ->> 'createdAt')::timestamp, now()) as created_at,
    id,
    ROW_NUMBER() OVER (PARTITION BY LOWER(REGEXP_REPLACE(
      COALESCE((influencer_data ->> 'displayName')::text, full_name, 'influencer'),
      '[^a-zA-Z0-9_]', '_', 'g'
    )) ORDER BY id) as handle_occurrence
  FROM public.profiles
  WHERE influencer_data IS NOT NULL
    AND influencer_data != '{}'::jsonb
),
unique_handles AS (
  SELECT
    pd.*,
    CASE
      -- Check if this base handle already exists in the influencers table
      WHEN EXISTS (
        SELECT 1 FROM public.influencers i 
        WHERE i.handle = pd.base_handle AND i.email != pd.email
      ) THEN pd.base_handle || '_' || pd.handle_occurrence::text
      ELSE pd.base_handle
    END as unique_handle
  FROM profile_data pd
)
INSERT INTO public.influencers (
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
  name,
  email,
  unique_handle as handle,
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
  'self-registered' as source,
  'verified' as status,
  created_at,
  now() as updated_at
FROM unique_handles
ON CONFLICT (email) DO UPDATE SET
  handle = COALESCE(influencers.handle, EXCLUDED.handle),
  bio = COALESCE(NULLIF(EXCLUDED.bio, ''), influencers.bio),
  location = COALESCE(NULLIF(EXCLUDED.location, ''), influencers.location),
  profile_photo = COALESCE(influencers.profile_photo, EXCLUDED.profile_photo),
  category = CASE 
    WHEN EXCLUDED.category != 'Other' THEN EXCLUDED.category
    ELSE COALESCE(influencers.category, EXCLUDED.category)
  END,
  instagram_url = COALESCE(NULLIF(EXCLUDED.instagram_url, ''), influencers.instagram_url),
  youtube_url = COALESCE(NULLIF(EXCLUDED.youtube_url, ''), influencers.youtube_url),
  tiktok_url = COALESCE(NULLIF(EXCLUDED.tiktok_url, ''), influencers.tiktok_url),
  audience_size = COALESCE(EXCLUDED.audience_size, influencers.audience_size),
  collaboration_interests = COALESCE(EXCLUDED.collaboration_interests, influencers.collaboration_interests),
  portfolio_links = COALESCE(EXCLUDED.portfolio_links, influencers.portfolio_links),
  updated_at = now();

-- Verify migration
SELECT 
  COUNT(*) as total_influencers,
  COUNT(CASE WHEN source = 'self-registered' THEN 1 END) as self_registered,
  COUNT(CASE WHEN source = 'admin-added' THEN 1 END) as admin_added
FROM public.influencers;
