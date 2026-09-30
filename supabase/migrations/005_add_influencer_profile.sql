-- Add influencer profile data to profiles table (if not already added in 002_profiles.sql)
-- This allows influencers to persist their profile data across devices/browsers

alter table if exists public.profiles 
add column if not exists influencer_data jsonb default null;

create index if not exists profiles_influencer_data_idx on public.profiles using gin (influencer_data) where influencer_data IS NOT NULL;

comment on column public.profiles.influencer_data is 'JSON object containing influencer profile: displayName, bio, location, profilePhoto, categories, socialLinks, audienceSize, collaborationInterests, portfolioLinks';
