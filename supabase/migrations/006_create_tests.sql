create table if not exists tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null,
  subject_set jsonb not null default '[]'::jsonb,
  started_at timestamptz,
  finished_at timestamptz,
  score int,
  duration_seconds int
);

create table if not exists testitems (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references tests(id) on delete cascade,
  practice_item_id uuid references chapterpracticeitems(id) on delete cascade,
  "order" int not null
);
