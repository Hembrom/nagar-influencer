-- If you already ran the old schema, run this migration in Supabase SQL editor

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  payment_ref text not null unique,
  order_id text not null references public.bookings (order_id) on delete cascade,
  amount integer not null default 500,
  currency text not null default 'INR',
  method text not null check (method in ('upi', 'card')),
  status text not null default 'success' check (
    status in ('pending', 'success', 'failed', 'refunded')
  ),
  provider text not null default 'dummy' check (
    provider in ('dummy', 'razorpay')
  ),
  provider_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_order_id_idx on public.payments (order_id);
create index if not exists payments_payment_ref_idx on public.payments (payment_ref);
create index if not exists payments_status_idx on public.payments (status);

alter table public.payments enable row level security;

drop policy if exists "Allow anon insert payments" on public.payments;
drop policy if exists "Allow anon select payments" on public.payments;

create policy "Allow anon insert payments"
  on public.payments
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow anon select payments"
  on public.payments
  for select
  to anon, authenticated
  using (true);
