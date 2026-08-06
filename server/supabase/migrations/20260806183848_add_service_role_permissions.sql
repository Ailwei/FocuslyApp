grant usage on schema public to service_role;

grant select, insert, update, delete
on public.profiles
to service_role;

grant select, insert, update, delete
on public.sessions
to service_role;

grant select, insert, update, delete
on public.badges
to service_role;

grant select, insert, update, delete
on public.user_badges
to service_role;