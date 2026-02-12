create table if not exists ai_cache (
  id uuid primary key default gen_random_uuid(),
  hash_key text not null unique,
  payload jsonb not null,
  source text,
  created_at timestamptz not null default now()
);
