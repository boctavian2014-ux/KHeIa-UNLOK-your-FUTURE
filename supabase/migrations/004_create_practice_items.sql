create table if not exists chapterpracticeitems (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references chapters(id) on delete cascade,
  question text not null,
  explanation text,
  difficulty text not null default 'medium'
);

create table if not exists chapterpracticeoptions (
  id uuid primary key default gen_random_uuid(),
  practice_item_id uuid references chapterpracticeitems(id) on delete cascade,
  text text not null,
  is_correct boolean not null default false
);
