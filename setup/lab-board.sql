-- Add board placement without changing access policies or existing content.
begin;
alter table public.lab_items add column if not exists board_section text check (board_section in ('ideas','subideas','resources','coding'));
alter table public.lab_items add column if not exists board_order double precision not null default 0;
commit;
