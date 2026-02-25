-- Duel sessions for realtime quiz duels between friends
create table if not exists duel_sessions (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  opponent_id uuid references auth.users(id) on delete set null,
  subject_id text,
  chapter_id text,
  status text not null default 'pending' check (status in ('pending', 'active', 'completed', 'expired')),
  invite_code text unique,
  creator_score int default 0,
  opponent_score int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz
);

-- Generate invite code on insert
create or replace function generate_duel_invite_code()
returns text as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
begin
  for i in 1..6 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  end loop;
  return result;
end;
$$ language plpgsql;

create or replace function set_duel_invite_code()
returns trigger as $$
begin
  if new.invite_code is null then
    loop
      new.invite_code := generate_duel_invite_code();
      exit when not exists (select 1 from duel_sessions where invite_code = new.invite_code);
    end loop;
  end if;
  if new.expires_at is null then
    new.expires_at := now() + interval '7 days';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger duel_sessions_invite_code_trigger
  before insert on duel_sessions
  for each row
  execute function set_duel_invite_code();

create index duel_sessions_invite_code_idx on duel_sessions(invite_code);
create index duel_sessions_creator_idx on duel_sessions(creator_id);
create index duel_sessions_status_idx on duel_sessions(status);

alter table duel_sessions enable row level security;

create policy "duel_sessions_select_own" on duel_sessions
  for select using (auth.uid() = creator_id or auth.uid() = opponent_id);
create policy "duel_sessions_insert_own" on duel_sessions
  for insert with check (auth.uid() = creator_id);
create policy "duel_sessions_update_own" on duel_sessions
  for update using (auth.uid() = creator_id or auth.uid() = opponent_id);
