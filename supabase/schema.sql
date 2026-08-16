-- Quick Taxi base schema

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  role text not null check (role in ('super_admin', 'admin', 'dispatcher')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.drivers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  vehicle text,
  registration text,
  vehicle_type text,
  capacity int,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  preferred_contact text not null,
  booking_type text not null default 'Advance Booking',
  journey_type text not null,
  pickup_address text not null,
  pickup_area text,
  destination_address text not null,
  destination_area text,
  pickup_date date not null,
  pickup_time time not null,
  return_date date,
  return_time time,
  return_pickup text,
  return_destination text,
  passengers int not null check (passengers between 1 and 6),
  large_luggage int not null default 0,
  small_luggage int not null default 0,
  flight_number text,
  airport text,
  airport_direction text,
  special_requirements text,
  quoted_fare text,
  status text not null default 'New Request',
  assigned_driver_id uuid references public.drivers(id),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.booking_status_history (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  old_status text,
  new_status text not null,
  changed_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image text,
  active boolean not null default true,
  sort_order int not null default 0
);

create table if not exists public.airports (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  active boolean not null default true,
  sort_order int not null default 0
);

create table if not exists public.service_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  active boolean not null default true,
  sort_order int not null default 0
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null
);

create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  message text,
  booking_id uuid references public.bookings(id) on delete cascade,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  entity text not null,
  entity_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_bookings_pickup_date on public.bookings(pickup_date);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_driver on public.bookings(assigned_driver_id);

alter table public.bookings enable row level security;
alter table public.drivers enable row level security;
alter table public.admin_users enable row level security;
alter table public.admin_notifications enable row level security;
alter table public.site_settings enable row level security;

create policy if not exists "public_can_insert_booking_requests"
on public.bookings
for insert
to anon, authenticated
with check (true);

create policy if not exists "admins_can_manage_bookings"
on public.bookings
for all
to authenticated
using (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid() and au.active = true
  )
)
with check (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid() and au.active = true
  )
);

create policy if not exists "admins_can_manage_drivers"
on public.drivers
for all
to authenticated
using (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid() and au.active = true
  )
)
with check (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid() and au.active = true
  )
);

create policy if not exists "admins_can_manage_admin_users"
on public.admin_users
for all
to authenticated
using (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid() and au.active = true and au.role = 'super_admin'
  )
)
with check (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid() and au.active = true and au.role = 'super_admin'
  )
);

create policy if not exists "admins_can_manage_notifications"
on public.admin_notifications
for all
to authenticated
using (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid() and au.active = true
  )
)
with check (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid() and au.active = true
  )
);

create policy if not exists "admins_can_manage_settings"
on public.site_settings
for all
to authenticated
using (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid() and au.active = true and au.role in ('super_admin', 'admin')
  )
)
with check (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid() and au.active = true and au.role in ('super_admin', 'admin')
  )
);
