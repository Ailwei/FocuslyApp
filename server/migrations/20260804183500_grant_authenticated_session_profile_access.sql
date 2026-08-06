-- Grant authenticated users access to app tables needed for session tracking.
GRANT SELECT, INSERT, UPDATE ON public.sessions TO authenticated;
GRANT SELECT ON public.badges TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
