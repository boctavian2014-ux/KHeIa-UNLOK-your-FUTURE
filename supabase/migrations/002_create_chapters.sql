create table if not exists chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references subjects(id) on delete cascade,
  title text not null,
  "order" int not null,
  published boolean not null default false,
  exam_tags jsonb not null default '[]'::jsonb,
  is_core_for_exam boolean not null default false
);
