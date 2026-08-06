-- Run these statements in Supabase SQL editor to create the app tables.

create table profiles (
  id uuid primary key,
  email text not null,
  name text,
  member_since text,
  created_at timestamp with time zone default timezone('utc', now())
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
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  category text not null,
  unlocked boolean not null default false,
  created_at timestamptz default timezone('utc', now())
);
