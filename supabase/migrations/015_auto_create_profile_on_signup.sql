-- Auto-create a profile row when a new user signs up (email or OAuth e.g. Google).
-- Ensures Google sign-in and email sign-up get a profiles row for referral, subscription, etc.

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

-- Trigger on auth.users (runs after insert)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
