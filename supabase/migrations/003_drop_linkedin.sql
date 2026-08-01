-- Remove LinkedIn from profiles (if column exists from earlier migration)

alter table public.profiles drop column if exists linkedin_url;
