# Database Migrations Guide - Influencer Registration Fix

## Overview
This guide walks you through running the necessary migrations to fix influencer data not appearing in the database.

## Problem
- Influencers were registering but data wasn't showing in `profiles` or `influencers` tables
- Root cause: Missing RLS policies and incorrect data handling

## Solution
Run these 4 migrations in order in Supabase SQL Editor:

---

## Step 1️⃣: Update RLS Policies (REQUIRED)

**File:** `migrations/007_update_influencers_rls.sql`

This makes the RLS policies less restrictive so insert/update/delete operations work.

```sql
-- Drop existing insert policy
DROP POLICY IF EXISTS "Allow authenticated users to insert influencers" ON influencers;

-- Create new policy that allows both authenticated and anon users to insert
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
```

**What it does:**
- Removes authentication requirement for inserts (needed for development)
- Allows both authenticated and anonymous users to read/write
- Prevents the "permission denied" errors

---

## Step 2️⃣: Update Table Schema (RECOMMENDED)

**File:** `migrations/008_update_influencers_schema.sql`

Makes the schema more flexible for optional fields.

```sql
-- Make followers nullable
ALTER TABLE influencers
  ALTER COLUMN followers DROP NOT NULL;

-- Set default for portfolio_links
ALTER TABLE influencers
  ALTER COLUMN portfolio_links SET DEFAULT ARRAY[]::TEXT[];

-- Add missing index on updated_at
CREATE INDEX IF NOT EXISTS idx_influencers_updated_at ON influencers(updated_at DESC);
```

**What it does:**
- Allows records with missing/null followers data
- Ensures proper defaults for array fields
- Adds performance indexes

---

## Step 3️⃣: Migrate Existing Data (OPTIONAL but RECOMMENDED)

**File:** `migrations/006_migrate_influencer_profiles.sql`

Moves any existing influencer data from `profiles` table's JSON to `influencers` table.

```sql
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

-- Show results
SELECT 
  COUNT(*) as total_influencers,
  COUNT(CASE WHEN source = 'self-registered' THEN 1 END) as self_registered,
  COUNT(CASE WHEN source = 'admin-added' THEN 1 END) as admin_added,
  COUNT(CASE WHEN status = 'verified' THEN 1 END) as verified
FROM influencers;
```

**What it does:**
- Extracts displayName, bio, categories, social links from profiles.influencer_data JSON
- Inserts them as proper rows in influencers table
- Maps JSON fields to table columns
- Generates unique handles from display names
- Shows a summary of migrated data

---

## How to Run These Migrations

### Option A: Run Individually (Recommended for first time)

1. **Go to Supabase Dashboard** → Your Project
2. Click **SQL Editor** → **New Query**
3. Copy the SQL from each migration file above
4. Paste and click **Run**
5. Check console for success message
6. Repeat for each migration

### Option B: Run All at Once

Copy-paste all SQL blocks into one query (not recommended - harder to debug if something fails)

---

## Testing After Migrations

### 1. Verify RLS Policies
Go to **Table Editor** → Select **influencers** table → Click ⚙️ **Policies** tab
You should see:
- ✅ "Allow anyone to insert influencers"
- ✅ "Allow anyone to read influencers"
- ✅ "Allow users to update influencers"
- ✅ "Allow authenticated users to delete influencers"

### 2. Test New Registration
1. Open `/influencer/login` in your app
2. Complete the influencer setup form
3. Open DevTools Console (F12)
4. Look for green checkmarks: `✓ Influencer registered in influencers table`
5. Go to Supabase Table Editor → **influencers** tab
6. You should see a new row with your data

### 3. Check Migrated Data (if you ran migration #3)
Go to Supabase Table Editor → **influencers** tab
- Should see all existing influencers from profiles table
- Check the counts match the SELECT query output

---

## Troubleshooting

### "Permission denied" error
→ Run Migration #1 (RLS policies) again

### "Duplicate key value violates unique constraint"
→ You're trying to register with an email that already exists
→ Use a different email address

### "Column doesn't exist" error
→ Make sure you ran Migration #1 first to create/fix table structure

### Data not appearing in influencers table
1. Check browser console for errors (F12)
2. Verify Supabase env vars are set correctly
3. Try re-running Migration #1 (RLS policies)
4. Check that email is not null

---

## Summary

| Migration | File | Purpose | Required? |
|-----------|------|---------|-----------|
| #1 | `007_update_influencers_rls.sql` | Fix RLS policies | ✅ YES |
| #2 | `008_update_influencers_schema.sql` | Make schema flexible | ✅ YES |
| #3 | `006_migrate_influencer_profiles.sql` | Move existing data | ⚠️ If you have old data |

**Key fixes in code:**
- ✅ Removed `id: userId` from influencer insert (was causing conflicts)
- ✅ Removed unnecessary handle generation logic
- ✅ Added better error logging
- ✅ RLS policies now allow inserts from client-side

---

## Questions?

Check the browser console (F12) for detailed error messages when registering. The code logs:
- `✓ Influencer profile saved to profiles table`
- `✓ Influencer registered in influencers table`
- `❌ Error saving to influencers table: [detailed error]`
