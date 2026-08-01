-- Scope bookings to the logged-in user

alter table public.bookings
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists bookings_user_id_idx on public.bookings (user_id);

-- Tighten RLS: users only see their own bookings
drop policy if exists "Allow anon insert bookings" on public.bookings;
drop policy if exists "Allow anon select bookings" on public.bookings;
drop policy if exists "Users insert own bookings" on public.bookings;
drop policy if exists "Users select own bookings" on public.bookings;

create policy "Users insert own bookings"
  on public.bookings
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users select own bookings"
  on public.bookings
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Keep anon insert disabled for cross-account leakage; demo uses localStorage when not logged in
