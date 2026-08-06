-- Profiles
grant select, insert, update on table public.profiles
to authenticated;


-- Sessions
grant select, insert on table public.sessions
to authenticated;


-- Badges
grant select on table public.badges
to authenticated;


-- User badges
grant select on table public.user_badges
to authenticated;