-- Reservations, contact messages, and event enquiries.
-- Run this in the Supabase SQL editor (or with `supabase db push`).

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('reservation', 'contact', 'event')),
  venue text,
  full_name text not null,
  email text,
  phone text,
  subject text,
  event_type text,
  preferred_date date,
  preferred_time text,
  guests integer,
  message text,
  created_at timestamptz not null default now()
);

grant all on public.enquiries to service_role;
grant insert on public.enquiries to anon, authenticated;
grant select, delete on public.enquiries to authenticated;

alter table public.enquiries enable row level security;

drop policy if exists "Anyone can send an enquiry" on public.enquiries;
create policy "Anyone can send an enquiry"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Staff can read enquiries" on public.enquiries;
create policy "Staff can read enquiries"
  on public.enquiries
  for select
  to authenticated
  using (true);

drop policy if exists "Staff can delete enquiries" on public.enquiries;
create policy "Staff can delete enquiries"
  on public.enquiries
  for delete
  to authenticated
  using (true);
