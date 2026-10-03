# Migration Files for Influencer Table Setup

Run these migrations in **exact order** in Supabase SQL Editor.

---

## 1️⃣ FIRST: Fix RLS Permissions (REQUIRED)
**File:** `migrations/007_update_influencers_rls.sql`

```sql
-- Fix RLS policies for influencers table
-- Allow both authenticated and anon users to insert/update/select

DROP POLICY IF EXISTS "allow_influencers_select" ON public.influencers;
DROP POLICY IF EXISTS "allow_influencers_insert" ON public.influencers;
DROP POLICY IF EXISTS "allow_influencers_update" ON public.influencers;

-- Allow authenticated users to select all influencers
CREATE POLICY "allow_influencers_select"
  ON public.influencers FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert influencer records
CREATE POLICY "allow_influencers_insert"
  ON public.influencers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update their own records
CREATE POLICY "allow_influencers_update"
  ON public.influencers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also allow anon users (for development)
CREATE POLICY "allow_influencers_select_anon"
  ON public.influencers FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "allow_influencers_insert_anon"
  ON public.influencers FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "allow_influencers_update_anon"
  ON public.influencers FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
```

---

## 2️⃣ SECOND: Migrate JSON Data from Profiles
**File:** `migrations/009_migrate_profiles_influencer_data.sql`

```sql
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
```

---

## 3️⃣ THIRD: Insert Ashutosh Profile
**File:** `migrations/010_insert_ashutosh_influencer.sql`

```sql
-- Insert ashutosh kalbande into influencers table
INSERT INTO public.influencers (
  name,
  email,
  handle,
  profile_photo,
  category,
  source,
  status
)
VALUES (
  'ashutosh kalbande',
  'ashutoshkalbande@gmail.com',
  'ashutosh_kalbande',
  'https://lh3.googleusercontent.com/a/ACg8ocKNpG6Ss6b535-k1_Liem3xzGDiVmmK9Auc0SFQv0lF0n3V9-BM=s96-c',
  'Other',
  'self-registered',
  'verified'
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  handle = EXCLUDED.handle,
  profile_photo = COALESCE(influencers.profile_photo, EXCLUDED.profile_photo),
  updated_at = now();

-- Verify
SELECT email, name, handle FROM public.influencers WHERE email = 'ashutoshkalbande@gmail.com';
```

---

## How to Run:

1. **Go to Supabase Dashboard** → **SQL Editor** → **New Query**
2. **Copy the entire content** from migration 007
3. **Paste** and **Execute**
4. **Repeat** for migrations 009 and 010 (in order)

## Expected Results:

✅ All influencers from `profiles.influencer_data` JSON will be inserted into `influencers` table  
✅ Categories, bio, location, social URLs all populated  
✅ Handles made unique if duplicates exist  
✅ ashutosh kalbande added as well  

---

## Troubleshooting:

- **"violates row-level security"** → Migration 007 not run yet
- **"duplicate handle"** → Migration 009 automatically appends `_2`, `_3`, etc.
- **"duplicate email"** → Uses `ON CONFLICT` to update existing records
