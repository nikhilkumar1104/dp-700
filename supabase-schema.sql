-- DP-700 simulator: per-user cloud progress and result history.
-- Run this entire file once in Supabase Dashboard > SQL Editor.

create table if not exists public.dp700_user_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_id text not null,
  progress jsonb,
  status text not null default 'not_started'
    check (status in ('not_started', 'active', 'submitted')),
  attempt_history jsonb not null default '[]'::jsonb,
  last_score integer check (last_score between 0 and 100),
  best_score integer check (best_score between 0 and 100),
  total_attempts integer not null default 0 check (total_attempts >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, exam_id)
);

alter table public.dp700_user_progress enable row level security;

revoke all on table public.dp700_user_progress from anon;
grant select, insert, update, delete on table public.dp700_user_progress to authenticated;

drop policy if exists "Users can read their own DP700 progress"
  on public.dp700_user_progress;
create policy "Users can read their own DP700 progress"
  on public.dp700_user_progress
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own DP700 progress"
  on public.dp700_user_progress;
create policy "Users can create their own DP700 progress"
  on public.dp700_user_progress
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own DP700 progress"
  on public.dp700_user_progress;
create policy "Users can update their own DP700 progress"
  on public.dp700_user_progress
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own DP700 progress"
  on public.dp700_user_progress;
create policy "Users can delete their own DP700 progress"
  on public.dp700_user_progress
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
