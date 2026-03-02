-- Rulează în Supabase Dashboard → SQL Editor → New query (copiază tot, fără liniile ```).
-- Creează tabelul profiles (dacă lipsește), funcții, trigger-e și politici necesare pentru înregistrare.

-- 1. Tabelul profiles (cu toate coloanele)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  referral_code text unique,
  referred_by uuid references auth.users(id) on delete set null,
  school text,
  display_name text,
  subscription_type text default 'free' check (subscription_type in ('free', 'monthly', 'yearly', 'full_edumat')),
  referral_premium_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Coloane adăugate ulterior (dacă tabelul exista deja fără ele)
alter table public.profiles
  add column if not exists subscription_type text default 'free' check (subscription_type in ('free', 'monthly', 'yearly', 'full_edumat'));
alter table public.profiles
  add column if not exists referral_premium_until timestamptz;

-- 3. Funcție cod referral
create or replace function public.generate_referral_code()
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

-- 4. Trigger: setare referral_code la insert
create or replace function public.set_profile_referral_code()
returns trigger as $$
begin
  if new.referral_code is null then
    loop
      new.referral_code := public.generate_referral_code();
      exit when not exists (select 1 from public.profiles where referral_code = new.referral_code);
    end loop;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_referral_code_trigger on public.profiles;
create trigger profiles_referral_code_trigger
  before insert on public.profiles
  for each row
  execute function public.set_profile_referral_code();

-- 5. RLS pe profiles
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- 6. Politică care permite crearea profilului din trigger la signup (fix "Database error saving new user")
drop policy if exists "profiles_insert_auth_new_user" on public.profiles;
create policy "profiles_insert_auth_new_user" on public.profiles
  for insert
  with check (exists (select 1 from auth.users u where u.id = id));

-- 7. Index și funcție validare referral
create index if not exists profiles_referral_code_idx on public.profiles(referral_code);

create or replace function public.validate_referral_code(code text)
returns uuid as $$
  select id from public.profiles where referral_code = code limit 1;
$$ language sql security definer;

-- 8. Auto-creare profil la signup (email sau Google)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  name_val text;
begin
  name_val := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );
  insert into public.profiles (id, display_name)
  values (new.id, name_val)
  on conflict (id) do update set
    display_name = coalesce(profiles.display_name, excluded.display_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
