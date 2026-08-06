-- Fix access for authenticated users to app tables
GRANT SELECT, INSERT, UPDATE ON public.sessions TO authenticated;
GRANT SELECT ON public.badges TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can select own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.role() = 'authenticated' AND id = auth.uid());

CREATE POLICY "Authenticated can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND id = auth.uid());

CREATE POLICY "Authenticated can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.role() = 'authenticated' AND id = auth.uid())
  WITH CHECK (auth.role() = 'authenticated' AND id = auth.uid());
