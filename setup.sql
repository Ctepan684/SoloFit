-- SoloFit: данные каждого пользователя в отдельной строке.
-- Выполнить один раз: Supabase → SQL Editor → New query → Run.

create table if not exists public.solofit_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint solofit_data_size check (pg_column_size(data) < 900000)
);

alter table public.solofit_data enable row level security;

-- Каждый видит и меняет только свою строку
drop policy if exists "solofit own select" on public.solofit_data;
drop policy if exists "solofit own insert" on public.solofit_data;
drop policy if exists "solofit own update" on public.solofit_data;

create policy "solofit own select" on public.solofit_data
  for select using (auth.uid() = user_id);
create policy "solofit own insert" on public.solofit_data
  for insert with check (auth.uid() = user_id);
create policy "solofit own update" on public.solofit_data
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
