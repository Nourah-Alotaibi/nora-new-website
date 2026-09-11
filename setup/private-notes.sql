create table if not exists public.private_notes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text check (char_length(name) <= 100),
  note text not null check (char_length(trim(note)) between 1 and 4000)
);
alter table public.private_notes enable row level security;
revoke all on public.private_notes from anon, authenticated;
grant insert on public.private_notes to service_role;
-- No public read or write policies. View notes only in the owner's dashboard.
