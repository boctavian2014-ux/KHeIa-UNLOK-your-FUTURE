-- Gamification: coins, XP, streak, rewards

create table if not exists user_gamification (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  coins int not null default 0,
  total_xp int not null default 0,
  streak_days int not null default 0,
  last_streak_at date,
  updated_at timestamptz not null default now()
);

create table if not exists coin_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  amount int not null,
  type text not null check (type in ('earn', 'redeem')),
  source text not null,
  source_id text,
  created_at timestamptz not null default now()
);

create table if not exists rewards_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  coins_cost int not null,
  partner_name text,
  partner_location text,
  reward_type text not null default 'voucher_cafe',
  is_active boolean not null default true,
  image_url text
);

create table if not exists reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  reward_id uuid not null references rewards_catalog(id) on delete restrict,
  coins_spent int not null,
  status text not null default 'pending' check (status in ('pending', 'claimed')),
  voucher_code text,
  created_at timestamptz not null default now()
);

-- RLS
alter table user_gamification enable row level security;
alter table coin_transactions enable row level security;
alter table reward_redemptions enable row level security;

create policy "user_gamification_select_own" on user_gamification
  for select using (auth.uid() = user_id);
create policy "user_gamification_modify_own" on user_gamification
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "coin_transactions_select_own" on coin_transactions
  for select using (auth.uid() = user_id);
create policy "coin_transactions_insert_own" on coin_transactions
  for insert with check (auth.uid() = user_id);

create policy "reward_redemptions_select_own" on reward_redemptions
  for select using (auth.uid() = user_id);
create policy "reward_redemptions_insert_own" on reward_redemptions
  for insert with check (auth.uid() = user_id);

-- rewards_catalog: public read
create policy "rewards_catalog_select_all" on rewards_catalog
  for select using (true);

-- Seed placeholder rewards for testing
insert into rewards_catalog (name, description, coins_cost, partner_name, partner_location, reward_type)
values
  ('Cafea la bar', 'O cafea oferită de KhEla la o cafenea parteneră', 50, 'Cafenea parteneră', 'București', 'voucher_cafe'),
  ('Croissant + cafea', 'Micul dejun – croissant și cafea', 100, 'Cafenea parteneră', 'București', 'voucher_cafe');
