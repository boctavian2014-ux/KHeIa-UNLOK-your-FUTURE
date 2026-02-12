create table if not exists chapterdetails (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references chapters(id) on delete cascade,
  overview text,
  sections jsonb not null default '[]'::jsonb,
  keypoints jsonb not null default '[]'::jsonb
);
