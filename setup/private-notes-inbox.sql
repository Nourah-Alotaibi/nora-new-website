-- PREPARED ONLY. Review before running in the EXISTING Supabase project.
-- Replace the single placeholder with your manually created Auth user's UUID.
-- This deliberately fails if the table/user is missing or unknown policies exist.
begin;
do $migration$
declare
  owner_id uuid := 'REPLACE_WITH_ADMIN_USER_UUID';
begin
  if to_regclass('public.private_notes') is null then
    raise exception 'Existing private_notes table not found. Stop and inspect the project.';
  end if;
  if not exists (select 1 from auth.users where id = owner_id) then
    raise exception 'Create the owner Auth user first.';
  end if;
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'private_notes'
    and policyname not in ('notes_owner_select', 'notes_owner_update', 'notes_owner_delete')) then
    raise exception 'Unexpected existing notes policies. Review them before applying this migration.';
  end if;
  alter table public.private_notes add column if not exists is_read boolean not null default false;
  alter table public.private_notes add column if not exists is_favorite boolean not null default false;
  alter table public.private_notes enable row level security;
  revoke all on table public.private_notes from public, anon, authenticated;
  grant select, delete on table public.private_notes to authenticated;
  grant update (is_read, is_favorite) on table public.private_notes to authenticated;
  -- Preserve the existing public submission endpoint's server-only insert permission.
  grant insert on table public.private_notes to service_role;
  drop policy if exists notes_owner_select on public.private_notes;
  drop policy if exists notes_owner_update on public.private_notes;
  drop policy if exists notes_owner_delete on public.private_notes;
  execute format('create policy notes_owner_select on public.private_notes for select to authenticated using ((select auth.uid()) = %L::uuid)', owner_id);
  execute format('create policy notes_owner_update on public.private_notes for update to authenticated using ((select auth.uid()) = %L::uuid) with check ((select auth.uid()) = %L::uuid)', owner_id, owner_id);
  execute format('create policy notes_owner_delete on public.private_notes for delete to authenticated using ((select auth.uid()) = %L::uuid)', owner_id);
end
$migration$;
commit;

-- Review these results: RLS true, three owner policies, no anon grants.
select relrowsecurity from pg_class where oid = 'public.private_notes'::regclass;
select policyname, cmd, roles, qual, with_check from pg_policies
where schemaname = 'public' and tablename = 'private_notes';
