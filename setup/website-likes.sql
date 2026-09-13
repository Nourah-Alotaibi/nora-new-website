create table if not exists public.website_likes (
  visitor_id uuid primary key,
  created_at timestamptz not null default now()
);
alter table public.website_likes enable row level security;
revoke all on public.website_likes from anon, authenticated;
grant select, insert on public.website_likes to service_role;
