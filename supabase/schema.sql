-- Run this file in the Supabase SQL Editor.
-- Each user can only access their own saved estimates.

create table if not exists public.saved_estimates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null constraint saved_estimates_name_nonblank
    check (char_length(name) between 1 and 60 and name ~ '[^[:space:]]'),
  data jsonb not null default '{}'::jsonb
    constraint saved_estimates_data_object check (jsonb_typeof(data) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_estimates_user_updated_idx
  on public.saved_estimates (user_id, updated_at desc);

-- Apply the same checks when this script is run against an existing table.
-- NOT VALID preserves existing rows while enforcing the rules for new writes.
do $
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'saved_estimates_name_nonblank'
      and conrelid = 'public.saved_estimates'::regclass
  ) then
    alter table public.saved_estimates
      add constraint saved_estimates_name_nonblank
      check (char_length(name) between 1 and 60 and name ~ '[^[:space:]]') not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'saved_estimates_data_object'
      and conrelid = 'public.saved_estimates'::regclass
  ) then
    alter table public.saved_estimates
      add constraint saved_estimates_data_object
      check (jsonb_typeof(data) = 'object') not valid;
  end if;
end $;

alter table public.saved_estimates enable row level security;

drop policy if exists "Users can read their own estimates" on public.saved_estimates;
create policy "Users can read their own estimates"
  on public.saved_estimates for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own estimates" on public.saved_estimates;
create policy "Users can create their own estimates"
  on public.saved_estimates for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own estimates" on public.saved_estimates;
create policy "Users can update their own estimates"
  on public.saved_estimates for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own estimates" on public.saved_estimates;
create policy "Users can delete their own estimates"
  on public.saved_estimates for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.set_estimate_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;

drop trigger if exists set_saved_estimates_updated_at on public.saved_estimates;
create trigger set_saved_estimates_updated_at
before update on public.saved_estimates
for each row execute procedure public.set_estimate_updated_at();

-- The browser uses only the authenticated role. Do not leave table privileges
-- for anonymous or PUBLIC roles from an earlier setup.
revoke all on table public.saved_estimates from anon, public;
grant select, insert, update, delete on public.saved_estimates to authenticated;
