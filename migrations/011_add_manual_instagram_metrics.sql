-- Optional manually entered Instagram profile metrics.
-- These are not API-derived and should be shown as manually maintained data.

ALTER TABLE public.influencers
  ADD COLUMN IF NOT EXISTS instagram_followers TEXT,
  ADD COLUMN IF NOT EXISTS instagram_following TEXT,
  ADD COLUMN IF NOT EXISTS instagram_posts TEXT;
