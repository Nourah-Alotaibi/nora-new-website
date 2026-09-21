-- Run once in the SAME Supabase project's SQL editor. No public-portfolio tables are changed.
begin;
create table public.lab_members (
 user_id uuid primary key references auth.users(id) on delete cascade,
 username text not null unique check (username in ('nora','sara'))
);
alter table public.lab_members enable row level security;
create function public.is_lab_member() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.lab_members where user_id = (select auth.uid()));
$$;
revoke all on function public.is_lab_member() from public;
grant execute on function public.is_lab_member() to authenticated;
revoke all on public.lab_members from anon, authenticated;
grant select on public.lab_members to authenticated;
create policy lab_members_read on public.lab_members for select to authenticated using ((select public.is_lab_member()));
create table public.lab_items (
 id uuid primary key default gen_random_uuid(),
 kind text not null check(kind in ('note','case','task','resource','shopping')),
 title text not null check(length(trim(title)) between 1 and 160),
 body text not null default '' check(length(body)<=12000),
 status text not null default 'idea' check(status in ('idea','doing','done')),
 color text not null default 'sage' check(color in ('sage','butter','rose','paper')),
 due_date date,
 url text not null default '' check(length(url)<=2048 and (url='' or url ~ '^https?://')),
 parent_id uuid references public.lab_items(id),
 created_by uuid not null default auth.uid() references auth.users(id),
 updated_by uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 version integer not null default 1,
 deleted boolean not null default false,
 check(parent_id is distinct from id)
);
create index lab_items_parent on public.lab_items(parent_id);
create table public.lab_edges (
 id uuid primary key default gen_random_uuid(), source_id uuid not null references public.lab_items(id),
 target_id uuid not null references public.lab_items(id), created_by uuid not null default auth.uid() references auth.users(id),
 deleted boolean not null default false, check(source_id <> target_id)
);
create unique index lab_edges_unique_active on public.lab_edges(least(source_id,target_id),greatest(source_id,target_id)) where not deleted;
create function public.lab_stamp_item() returns trigger language plpgsql set search_path = '' as $$
begin
 if TG_OP = 'INSERT' then
   NEW.created_by := auth.uid(); NEW.created_at := now(); NEW.version := 1;
 else
   NEW.id := OLD.id; NEW.created_by := OLD.created_by; NEW.created_at := OLD.created_at; NEW.version := OLD.version + 1;
 end if;
 NEW.updated_by := auth.uid(); NEW.updated_at := now();
 if NEW.parent_id is not null and not exists(select 1 from public.lab_items where id=NEW.parent_id and kind='case' and not deleted) then
   raise exception 'Related case is unavailable';
 end if;
 return NEW;
end; $$;
create trigger lab_item_attribution before insert or update on public.lab_items for each row execute function public.lab_stamp_item();
alter table public.lab_items enable row level security;
alter table public.lab_edges enable row level security;
revoke all on public.lab_items,public.lab_edges from anon, authenticated;
grant select,insert,update on public.lab_items,public.lab_edges to authenticated;
create policy lab_items_read on public.lab_items for select to authenticated using((select public.is_lab_member()));
create policy lab_items_insert on public.lab_items for insert to authenticated with check((select public.is_lab_member()) and created_by=(select auth.uid()) and updated_by=(select auth.uid()));
create policy lab_items_update on public.lab_items for update to authenticated using((select public.is_lab_member())) with check((select public.is_lab_member()) and updated_by=(select auth.uid()));
create policy lab_edges_read on public.lab_edges for select to authenticated using((select public.is_lab_member()));
create policy lab_edges_insert on public.lab_edges for insert to authenticated with check((select public.is_lab_member()) and created_by=(select auth.uid()));
-- Connections are immutable apart from soft archival.
revoke update on public.lab_edges from authenticated;
grant update(deleted) on public.lab_edges to authenticated;
create policy lab_edges_archive on public.lab_edges for update to authenticated using((select public.is_lab_member())) with check((select public.is_lab_member()));
-- Soft archive events retain their row identity and pass through Realtime RLS.
alter publication supabase_realtime add table public.lab_items, public.lab_edges;
-- Shared, atomic throttling across serverless instances. Not exposed to browser clients.
create table public.lab_rate_limits (key text primary key, started_at timestamptz not null, hits integer not null);
alter table public.lab_rate_limits enable row level security;
revoke all on public.lab_rate_limits from anon,authenticated;
create function public.lab_take_rate_limit(bucket text, max_hits integer, window_seconds integer) returns boolean language plpgsql security definer set search_path='' as $$
declare used integer;
begin
 delete from public.lab_rate_limits where started_at < now() - interval '1 day';
 insert into public.lab_rate_limits(key,started_at,hits) values(bucket,now(),1)
 on conflict(key) do update set
 hits=case when lab_rate_limits.started_at < now()-make_interval(secs=>window_seconds) then 1 else lab_rate_limits.hits+1 end,
 started_at=case when lab_rate_limits.started_at < now()-make_interval(secs=>window_seconds) then now() else lab_rate_limits.started_at end
 returning hits into used;
 return used <= max_hits;
end; $$;
revoke all on function public.lab_take_rate_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.lab_take_rate_limit(text,integer,integer) to service_role;
grant all on public.lab_members, public.lab_items, public.lab_edges, public.lab_rate_limits to service_role;
commit;
-- Create two password users in Supabase Auth (internal email identifiers may be used,
-- e.g. nora@lab.invalid and sara@lab.invalid; mark confirmed). No email UI is shown.
-- Then insert their actual UUIDs, never user-editable profile metadata:
-- insert into public.lab_members(user_id,username) values ('NORA_AUTH_UUID','nora'),('SARA_AUTH_UUID','sara');

