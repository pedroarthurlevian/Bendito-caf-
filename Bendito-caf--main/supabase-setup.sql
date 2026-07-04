-- Bendito Café - Estrutura Supabase
-- Rode este arquivo no SQL Editor do Supabase, caso ainda não tenha rodado.

create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  payment_method text,
  payment_status text not null default 'Aguardando pagamento no caixa',
  amount_paid numeric(10,2),
  change_given numeric(10,2),
  coupon text,
  source text default 'site',
  items_json jsonb not null default '[]'::jsonb
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  date text not null,
  time text not null,
  guests text not null,
  occasion text,
  notes text
);

create table if not exists public.cash_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_id uuid references public.orders(id) on delete set null,
  customer_name text,
  payment_method text not null,
  order_total numeric(10,2) not null default 0,
  amount_paid numeric(10,2) not null default 0,
  change_given numeric(10,2) not null default 0,
  note text
);

alter table public.orders enable row level security;
alter table public.reservations enable row level security;
alter table public.cash_entries enable row level security;

drop policy if exists "public_can_insert_orders" on public.orders;
drop policy if exists "authenticated_can_read_orders" on public.orders;
drop policy if exists "authenticated_can_update_orders" on public.orders;
drop policy if exists "public_can_insert_reservations" on public.reservations;
drop policy if exists "authenticated_can_read_reservations" on public.reservations;
drop policy if exists "authenticated_can_update_reservations" on public.reservations;
drop policy if exists "authenticated_can_manage_cash_entries" on public.cash_entries;

create policy "public_can_insert_orders"
on public.orders
for insert
to anon, authenticated
with check (true);

create policy "authenticated_can_read_orders"
on public.orders
for select
to authenticated
using (true);

create policy "authenticated_can_update_orders"
on public.orders
for update
to authenticated
using (true)
with check (true);

create policy "public_can_insert_reservations"
on public.reservations
for insert
to anon, authenticated
with check (true);

create policy "authenticated_can_read_reservations"
on public.reservations
for select
to authenticated
using (true);

create policy "authenticated_can_update_reservations"
on public.reservations
for update
to authenticated
using (true)
with check (true);

create policy "authenticated_can_manage_cash_entries"
on public.cash_entries
for all
to authenticated
using (true)
with check (true);
