create table session_distractions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  left_at timestamptz not null,
  returned_at timestamptz,
  duration_seconds integer,
  created_at timestamptz not null default now()
);

create index idx_session_distractions_session_id on session_distractions(session_id);

create index idx_session_distractions_session_id on session_distractions(session_id);

grant select, insert, update, delete on public.session_distractions to service_role;