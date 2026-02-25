-- Subscriptions table for RevenueCat / in-app purchase tracking
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_type text not null check (plan_type in ('free', 'monthly', 'yearly', 'full_edumat')),
  status text not null default 'active' check (status in ('active', 'canceled', 'expired')),
  current_period_end timestamptz,
  revenuecat_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index subscriptions_user_active_idx on subscriptions(user_id)
  where status = 'active';

alter table subscriptions enable row level security;

create policy "subscriptions_select_own" on subscriptions
  for select using (auth.uid() = user_id);
create policy "subscriptions_insert_own" on subscriptions
  for insert with check (auth.uid() = user_id);
create policy "subscriptions_update_own" on subscriptions
  for update using (auth.uid() = user_id);

-- Add subscription_type to profiles for quick lookup
alter table profiles
  add column if not exists subscription_type text default 'free'
    check (subscription_type in ('free', 'monthly', 'yearly', 'full_edumat'));
alter table profiles
  add column if not exists referral_premium_until timestamptz;

comment on column profiles.subscription_type is 'Cached from subscriptions or referral credits. free|monthly|yearly|full_edumat';
comment on column profiles.referral_premium_until is 'Premium until date from referral credits (5 invites = 1 month)';
