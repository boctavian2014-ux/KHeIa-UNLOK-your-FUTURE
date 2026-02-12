-- Align Supabase schema with app offline data (text IDs for subjects, chapters, etc.)
-- Requires dropping and recreating tables due to FK constraints.
-- Run this in Supabase Dashboard → SQL Editor if CLI db push fails.

create extension if not exists "pgcrypto";

-- 1. Drop user & test tables (reference catalog)
drop table if exists testitems;
drop table if exists tests;
drop table if exists userquizitems;
drop table if exists userchapterprogress;

-- 2. Drop practice & details (reference chapters)
drop table if exists chapterpracticeoptions;
drop table if exists chapterpracticeitems;
drop table if exists chapterdetails;

-- 3. Drop chapters (references subjects)
drop table if exists chapters;

-- 4. Drop subjects
drop table if exists subjects;

-- 5. Recreate subjects (text id)
create table subjects (
  id text primary key,
  name text not null,
  level text not null,
  exam_tags jsonb not null default '[]'::jsonb
);

-- 6. Recreate chapters (text id)
create table chapters (
  id text primary key,
  subject_id text not null references subjects(id) on delete cascade,
  title text not null,
  "order" int not null,
  published boolean not null default false,
  exam_tags jsonb not null default '[]'::jsonb,
  is_core_for_exam boolean not null default false
);

-- 7. Recreate chapterdetails
create table chapterdetails (
  id text primary key,
  chapter_id text not null references chapters(id) on delete cascade,
  overview text,
  sections jsonb not null default '[]'::jsonb,
  keypoints jsonb not null default '[]'::jsonb
);

-- 8. Recreate chapterpracticeitems
create table chapterpracticeitems (
  id text primary key,
  chapter_id text not null references chapters(id) on delete cascade,
  question text not null,
  explanation text,
  difficulty text not null default 'medium'
);

-- 9. Recreate chapterpracticeoptions
create table chapterpracticeoptions (
  id text primary key,
  practice_item_id text not null references chapterpracticeitems(id) on delete cascade,
  text text not null,
  is_correct boolean not null default false
);

-- 10. Recreate userchapterprogress (user_id uuid from auth.uid())
create table userchapterprogress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  chapter_id text not null references chapters(id) on delete cascade,
  status text not null default 'not_started',
  last_quiz_score int,
  updated_at timestamptz not null default now()
);

-- 11. Recreate userquizitems
create table userquizitems (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  practice_item_id text not null references chapterpracticeitems(id) on delete cascade,
  answered_at timestamptz not null default now(),
  is_correct boolean not null default false
);

-- 12. Recreate tests
create table tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null,
  subject_set jsonb not null default '[]'::jsonb,
  started_at timestamptz,
  finished_at timestamptz,
  score int,
  duration_seconds int
);

-- 13. Recreate testitems
create table testitems (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references tests(id) on delete cascade,
  practice_item_id text not null references chapterpracticeitems(id) on delete cascade,
  "order" int not null
);

-- 14. RLS for user data
alter table userchapterprogress enable row level security;
alter table userquizitems enable row level security;
alter table tests enable row level security;
alter table testitems enable row level security;

create policy "userchapterprogress_select_own" on userchapterprogress
  for select using (auth.uid() = user_id);
create policy "userchapterprogress_modify_own" on userchapterprogress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "userquizitems_select_own" on userquizitems
  for select using (auth.uid() = user_id);
create policy "userquizitems_modify_own" on userquizitems
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "tests_select_own" on tests
  for select using (auth.uid() = user_id);
create policy "tests_modify_own" on tests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "testitems_select_own" on testitems
  for select using (
    exists (
      select 1 from tests t where t.id = testitems.test_id and t.user_id = auth.uid()
    )
  );
create policy "testitems_modify_own" on testitems
  for all using (
    exists (
      select 1 from tests t where t.id = testitems.test_id and t.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from tests t where t.id = testitems.test_id and t.user_id = auth.uid()
    )
  );

-- 15. Public read for catalog (subjects, chapters, etc.) - no RLS = anon can read
-- Catalog tables remain without RLS for simplicity; anon key has read access by default.
