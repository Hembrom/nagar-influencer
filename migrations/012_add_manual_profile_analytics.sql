-- Manual profile analytics entered by an admin.
-- Values are maintained manually until social platform APIs are connected.

ALTER TABLE public.influencers
  ADD COLUMN IF NOT EXISTS engagement_rate TEXT,
  ADD COLUMN IF NOT EXISTS fake_score TEXT,
  ADD COLUMN IF NOT EXISTS trust_score TEXT,
  ADD COLUMN IF NOT EXISTS estimated_post_price TEXT,
  ADD COLUMN IF NOT EXISTS female_audience TEXT,
  ADD COLUMN IF NOT EXISTS male_audience TEXT,
  ADD COLUMN IF NOT EXISTS age_group TEXT,
  ADD COLUMN IF NOT EXISTS age_group_share TEXT,
  ADD COLUMN IF NOT EXISTS top_city TEXT,
  ADD COLUMN IF NOT EXISTS languages TEXT,
  ADD COLUMN IF NOT EXISTS reach_week_1 TEXT,
  ADD COLUMN IF NOT EXISTS reach_week_2 TEXT,
  ADD COLUMN IF NOT EXISTS reach_week_3 TEXT,
  ADD COLUMN IF NOT EXISTS reach_week_4 TEXT;
