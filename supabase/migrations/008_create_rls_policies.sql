alter table userchapterprogress enable row level security;
alter table userquizitems enable row level security;
alter table tests enable row level security;
alter table testitems enable row level security;

create policy "userchapterprogress_select_own" on userchapterprogress
  for select using (auth.uid() = user_id);
create policy "userchapterprogress_modify_own" on userchapterprogress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "userquizitems_select_own" on userquizitems
  for select using (auth.uid() = user_id);
create policy "userquizitems_modify_own" on userquizitems
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "tests_select_own" on tests
  for select using (auth.uid() = user_id);
create policy "tests_modify_own" on tests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "testitems_select_own" on testitems
  for select using (
    exists (
      select 1 from tests t where t.id = testitems.test_id and t.user_id = auth.uid()
    )
  );
