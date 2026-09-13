create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','super_admin','editor','viewer')),
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) >= 2 and length(name) <= 120),
  description text not null check (length(description) >= 1 and length(description) <= 2000),
  channel text not null check (channel in ('line', 'facebook', 'sms')),
  status text not null default 'draft' check (
    status in ('draft', 'scheduled', 'running', 'completed', 'failed', 'cancelled')
  ),
  scheduled_at timestamptz null,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_campaigns_created_by on public.campaigns(created_by);
create index if not exists idx_campaigns_status on public.campaigns(status);
create index if not exists idx_campaigns_scheduled_at on public.campaigns(scheduled_at);

alter table public.campaigns enable row level security;
alter table public.profiles enable row level security;

create or replace function public.set_campaigns_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_campaigns_updated_at on public.campaigns;

create trigger trg_campaigns_updated_at
before update on public.campaigns
for each row
execute function public.set_campaigns_updated_at();

drop policy if exists "campaigns_select_own" on public.campaigns;
drop policy if exists "campaigns_insert_own" on public.campaigns;
drop policy if exists "campaigns_update_own" on public.campaigns;
drop policy if exists "campaigns_delete_own" on public.campaigns;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_insert_admin" on public.profiles;
drop policy if exists "profiles_delete_admin" on public.profiles;

create policy "campaigns_select_own"
on public.campaigns for select
using (auth.uid() = created_by);

create policy "campaigns_insert_own"
on public.campaigns for insert
with check (auth.uid() = created_by);

create policy "campaigns_update_own"
on public.campaigns for update
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

create policy "campaigns_delete_own"
on public.campaigns for delete
using (auth.uid() = created_by);

create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id or auth.role() = 'authenticated');

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profiles_insert_admin"
on public.profiles for insert
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  )
);

create policy "profiles_delete_admin"
on public.profiles for delete
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  )
);
