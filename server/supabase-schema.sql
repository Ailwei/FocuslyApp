create table profiles (
  id uuid primary key,
  email text not null,
  name text,
  member_since text,
  created_at timestamptz default timezone('utc', now())
);


create table sessions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references profiles(id) on delete cascade,

  task text not null,

  duration_minutes integer not null,

  completed_at timestamptz not null,

  created_at timestamptz default timezone('utc', now())
);


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


create table user_badges (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references profiles(id) on delete cascade,

  badge_id uuid references badges(id) on delete cascade,

  unlocked_at timestamptz default timezone('utc', now()),

  unique(user_id, badge_id)
);