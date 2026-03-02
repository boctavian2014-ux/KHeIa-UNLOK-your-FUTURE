-- Allow profile creation from auth trigger (fixes "Database error saving new user" on signup).
-- Run in Supabase Dashboard → SQL Editor → New query. Then Run.

create policy "profiles_insert_auth_new_user"
  on public.profiles
  for insert
  with check (
    exists (select 1 from auth.users u where u.id = id)
  );
