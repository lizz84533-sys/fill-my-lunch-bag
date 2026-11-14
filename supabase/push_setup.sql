-- Fill My Lunch Bag: tip alerts (iPhone notifications)
-- Run this once in Supabase > SQL Editor.
-- It makes a table that keeps each creator's phone "alert address" (push token).

create table if not exists public.lunch_push_tokens (
  token       text primary key,
  creator_id  uuid not null references auth.users(id) on delete cascade,
  platform    text not null default 'ios',
  updated_at  timestamptz not null default now()
);

alter table public.lunch_push_tokens enable row level security;

-- Creators can only see and change their own phone tokens
drop policy if exists "push tokens: read own"   on public.lunch_push_tokens;
drop policy if exists "push tokens: add own"    on public.lunch_push_tokens;
drop policy if exists "push tokens: update own" on public.lunch_push_tokens;
drop policy if exists "push tokens: delete own" on public.lunch_push_tokens;
create policy "push tokens: read own"   on public.lunch_push_tokens for select using (auth.uid() = creator_id);
create policy "push tokens: add own"    on public.lunch_push_tokens for insert with check (auth.uid() = creator_id);
create policy "push tokens: update own" on public.lunch_push_tokens for update using (auth.uid() = creator_id) with check (auth.uid() = creator_id);
create policy "push tokens: delete own" on public.lunch_push_tokens for delete using (auth.uid() = creator_id);
