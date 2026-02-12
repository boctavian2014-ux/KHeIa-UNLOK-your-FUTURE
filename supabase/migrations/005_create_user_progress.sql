create table if not exists userchapterprogress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  chapter_id uuid references chapters(id) on delete cascade,
  status text not null default 'not_started',
  last_quiz_score int,
  updated_at timestamptz not null default now()
);

create table if not exists userquizitems (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  practice_item_id uuid references chapterpracticeitems(id) on delete cascade,
  answered_at timestamptz not null default now(),
  is_correct boolean not null default false
);
