create extension if not exists "pgcrypto";

create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level text not null,
  exam_tags jsonb not null default '[]'::jsonb
);
