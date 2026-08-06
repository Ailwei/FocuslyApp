-- Grant read access to authenticated role for profiles table
GRANT SELECT ON public.profiles TO authenticated;

-- If you use row-level security, ensure appropriate policies exist to allow
-- authenticated users to read allowed rows.
