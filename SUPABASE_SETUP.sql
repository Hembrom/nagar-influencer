-- ============================================================================
-- PROFILES TABLE - For storing user profile data (brands and influencers)
-- ============================================================================
-- This table stores:
-- 1. Brand profile data: email, full_name, avatar_url, mobile, company_name, website
-- 2. Influencer profile data: as JSON in the influencer_data column

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  mobile text,
  company_name text,
  website text,
  influencer_data jsonb default null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create indexes for performance
create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists profiles_influencer_data_idx on public.profiles using gin (influencer_data) where influencer_data IS NOT NULL;

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Drop existing policies to recreate them
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- Create Row Level Security policies
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Add comment for documentation
comment on table public.profiles is 'User profiles for both brand users and influencers';
comment on column public.profiles.influencer_data is 'JSON object with influencer profile: {displayName, bio, location, profilePhoto, categories, socialLinks, audienceSize, collaborationInterests, portfolioLinks, createdAt}';
