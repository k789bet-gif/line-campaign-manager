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
  channel text not null check (channel in ('LINE Official','SMS','Email','Push')),
  message text not null check (length(message) >= 1 and length(message) <= 500),
  scheduled_at timestamptz not null,
  status text not null check (status in ('draft','scheduled','running','completed','cancelled')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_campaigns_scheduled_at on public.campaigns(scheduled_at desc);
create index if not exists idx_campaigns_status on public.campaigns(status);

alter table public.campaigns enable row level security;
alter table public.profiles enable row level security;

create policy "Authenticated read campaigns" on public.campaigns
for select using (auth.role() = 'authenticated');

create policy "Admin manage campaigns" on public.campaigns
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin','super_admin','editor')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin','super_admin','editor')
  )
);

create policy "Authenticated read profiles" on public.profiles
for select using (auth.uid() = id or auth.role() = 'authenticated');

create policy "Admin manage profiles" on public.profiles
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin','super_admin')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin','super_admin')
  )
);
