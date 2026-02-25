-- Add consecutive_days_active for streak-based XP multipliers
alter table user_gamification
  add column if not exists consecutive_days_active int not null default 0;

comment on column user_gamification.consecutive_days_active is 'Days in a row user was active (quiz/test/chapter). Used for XP multipliers.';
