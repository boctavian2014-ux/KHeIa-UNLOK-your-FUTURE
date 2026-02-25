-- Profiles table for referral, school, and extended user data
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  referral_code text unique,
  referred_by uuid references auth.users(id) on delete set null,
  school text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Generate unique referral code on insert
create or replace function generate_referral_code()
returns text as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
begin
  for i in 1..8 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  end loop;
  return result;
end;
$$ language plpgsql;

-- Trigger: set referral_code on profile creation if not provided
create or replace function set_profile_referral_code()
returns trigger as $$
begin
  if new.referral_code is null then
    loop
      new.referral_code := generate_referral_code();
      exit when not exists (select 1 from profiles where referral_code = new.referral_code);
    end loop;
  end if;
  return new;
end;
$$ language plpgsql;

-- Trigger for new profiles
create trigger profiles_referral_code_trigger
  before insert on profiles
  for each row
  execute function set_profile_referral_code();

-- RLS
alter table profiles enable row level security;

create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- Index for referral_code lookup
create index if not exists profiles_referral_code_idx on profiles(referral_code);

-- Function to validate referral code (returns referrer id if valid)
create or replace function validate_referral_code(code text)
returns uuid as $$
  select id from profiles where referral_code = code limit 1;
$$ language sql security definer;
