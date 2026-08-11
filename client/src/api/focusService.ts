import { supabase, supabaseUrl, supabaseAnonKey } from '@/api/supabaseClient';
import { DistractionEvent } from '@/hooks/useDistractionDetector';

export const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('name, email, member_since')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const fetchSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('id, task, duration_minutes, completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const insertSession = async (
  userId: string,
  task: string,
  durationMinutes: number,
  completedAt: string,
  distractions: DistractionEvent[] = [],
) => {
  console.log("insertSession started", {
    userId,
    task,
    durationMinutes,
    completedAt,
    distractionCount: distractions.length,
  });

  const {
    data: sessionData,
    error: sessionError,
  } = await supabase.auth.getSession();

  console.log("getSession result:", sessionData.session);

  if (sessionError) throw sessionError;

  const token = sessionData.session?.access_token;


  if (!token) throw new Error('No authenticated session available');

  console.log("Calling Edge Function...");
  console.log("DISTRACTIONS BEING SENT:", distractions.length, JSON.stringify(distractions));

  const response = await fetch(`${supabaseUrl}/functions/v1/create-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify({
      task,
      duration_minutes: durationMinutes,
      completed_at: completedAt,
      distractions,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? 'Unable to create session');
  }

  return payload.session;
};