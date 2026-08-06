-- Enable RLS and add policies for authenticated users to manage their own sessions.
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can select own sessions"
  ON public.sessions
  FOR SELECT
  USING (auth.role() = 'authenticated' AND user_id = auth.uid());

CREATE POLICY "Authenticated can insert own sessions"
  ON public.sessions
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

CREATE POLICY "Authenticated can update own sessions"
  ON public.sessions
  FOR UPDATE
  USING (auth.role() = 'authenticated' AND user_id = auth.uid())
  WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());
