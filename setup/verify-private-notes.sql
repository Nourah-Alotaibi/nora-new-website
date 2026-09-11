-- Run AFTER reviewing/applying private-notes-inbox.sql. All test data rolls back.
-- Replace the owner UUID below. Run as the SQL editor's postgres role.
begin;
select set_config('notes.test_owner', 'REPLACE_WITH_ADMIN_USER_UUID', true);
insert into public.private_notes(id, name, note) values
('ef9d9ceb-e714-4903-b94e-b9e464e4df87', 'Temporary security check', 'This row is rolled back.');
do $$ begin
 if not (select relrowsecurity from pg_class where oid='public.private_notes'::regclass) then raise exception 'RLS is disabled'; end if;
end $$;
set local role anon;
do $$ begin
 begin perform * from public.private_notes; raise exception 'FAIL: anon could select'; exception when insufficient_privilege then null; end;
 begin update public.private_notes set is_read=true; raise exception 'FAIL: anon could update'; exception when insufficient_privilege then null; end;
 begin delete from public.private_notes; raise exception 'FAIL: anon could delete'; exception when insufficient_privilege then null; end;
end $$;
reset role;
select set_config('request.jwt.claim.sub', '52e5f377-a046-4b03-bffa-28049c13128f', true);
set local role authenticated;
do $$ declare n integer; begin
 if exists(select 1 from public.private_notes) then raise exception 'FAIL: non-owner could read'; end if;
 update public.private_notes set is_read=true; get diagnostics n=row_count;
 if n<>0 then raise exception 'FAIL: non-owner could update'; end if;
 delete from public.private_notes; get diagnostics n=row_count;
 if n<>0 then raise exception 'FAIL: non-owner could delete'; end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub', current_setting('notes.test_owner'), true);
set local role authenticated;
do $$ declare n integer; begin
 if not exists(select 1 from public.private_notes where id='ef9d9ceb-e714-4903-b94e-b9e464e4df87') then raise exception 'FAIL: owner cannot read'; end if;
 update public.private_notes set is_read=true,is_favorite=true where id='ef9d9ceb-e714-4903-b94e-b9e464e4df87';
 get diagnostics n=row_count; if n<>1 then raise exception 'FAIL: owner cannot update'; end if;
 begin update public.private_notes set note='Changed' where id='ef9d9ceb-e714-4903-b94e-b9e464e4df87'; raise exception 'FAIL: owner can overwrite message'; exception when insufficient_privilege then null; end;
 delete from public.private_notes where id='ef9d9ceb-e714-4903-b94e-b9e464e4df87';
 get diagnostics n=row_count; if n<>1 then raise exception 'FAIL: owner cannot delete'; end if;
end $$;
reset role;
rollback;
select 'Security checks passed; test data rolled back.' as result;
