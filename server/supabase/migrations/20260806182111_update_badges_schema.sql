
-- Remove old badge table
drop table if exists badges cascade;

-- Create badge definitions
create table badges (
  id uuid primary key default gen_random_uuid(),

  title text not null,

  description text not null,

  category text not null,

  rule_type text not null,

  rule_value integer not null,

  icon text,

  created_at timestamptz default timezone('utc', now())
);


-- Create user earned badges table
create table user_badges (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references profiles(id) on delete cascade,

  badge_id uuid references badges(id) on delete cascade,

  unlocked_at timestamptz default timezone('utc', now()),

  unique(user_id, badge_id)
);