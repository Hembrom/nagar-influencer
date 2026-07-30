-- Run this in the Supabase SQL editor

create extension if not exists "pgcrypto";

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  format_id text not null,
  package_name text not null,
  token_amount integer not null default 500,
  payment_method text not null check (payment_method in ('upi', 'card')),
  status text not null default 'order_placed' check (
    status in (
      'order_placed',
      'representative_assigned',
      'campaign_finalized',
      'campaign_live',
      'cancelled',
      'refunded'
    )
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_order_id_idx on public.bookings (order_id);
create index if not exists bookings_status_idx on public.bookings (status);

alter table public.bookings enable row level security;

-- Open insert/select for anon for now (tighten when auth is added)
create policy "Allow anon insert bookings"
  on public.bookings
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow anon select bookings"
  on public.bookings
  for select
  to anon, authenticated
  using (true);
