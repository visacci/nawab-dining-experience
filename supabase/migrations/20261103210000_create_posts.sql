-- Stories published from the staff dashboard.
-- Run this in the Supabase SQL editor (or with `supabase db push`).

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  cover_url text,
  cover_alt text,
  content jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_idx
  on public.posts (published_at desc)
  where status = 'published';

grant all on public.posts to service_role;
grant select on public.posts to anon;
grant select, insert, update, delete on public.posts to authenticated;

alter table public.posts enable row level security;

drop policy if exists "Anyone can read published posts" on public.posts;
create policy "Anyone can read published posts"
  on public.posts
  for select
  to anon
  using (status = 'published');

drop policy if exists "Staff can read every post" on public.posts;
create policy "Staff can read every post"
  on public.posts
  for select
  to authenticated
  using (true);

drop policy if exists "Staff can create posts" on public.posts;
create policy "Staff can create posts"
  on public.posts
  for insert
  to authenticated
  with check (true);

drop policy if exists "Staff can update posts" on public.posts;
create policy "Staff can update posts"
  on public.posts
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Staff can delete posts" on public.posts;
create policy "Staff can delete posts"
  on public.posts
  for delete
  to authenticated
  using (true);

create or replace function public.set_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row
  execute function public.set_posts_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view blog images" on storage.objects;
create policy "Public can view blog images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'blog-images');

drop policy if exists "Staff can upload blog images" on storage.objects;
create policy "Staff can upload blog images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'blog-images');

drop policy if exists "Staff can update blog images" on storage.objects;
create policy "Staff can update blog images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'blog-images');

drop policy if exists "Staff can delete blog images" on storage.objects;
create policy "Staff can delete blog images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'blog-images');
