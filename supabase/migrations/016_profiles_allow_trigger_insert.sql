-- Allow profile creation from auth trigger (handle_new_user).
-- The trigger runs after insert on auth.users; at that moment auth.uid() may not be set,
-- so "profiles_insert_own" (auth.uid() = id) can block the insert and cause "Database error saving new user".
-- This policy allows insert when the row's id exists in auth.users (only the trigger inserts such rows).

create policy "profiles_insert_auth_new_user"
  on public.profiles
  for insert
  with check (
    exists (select 1 from auth.users u where u.id = id)
  );
