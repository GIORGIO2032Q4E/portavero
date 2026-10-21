-- Run this file in the Supabase SQL Editor.
-- Each user can only access their own saved estimates.

create table if not exists public.saved_estimates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_estimates_user_updated_idx
  on public.saved_estimates (user_id, updated_at desc);

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
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_saved_estimates_updated_at on public.saved_estimates;
create trigger set_saved_estimates_updated_at
before update on public.saved_estimates
for each row execute procedure public.set_estimate_updated_at();

grant select, insert, update, delete on public.saved_estimates to authenticated;
