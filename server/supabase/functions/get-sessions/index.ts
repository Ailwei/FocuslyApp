import { createSupabaseClient, jsonResponse } from '../_shared.ts';

export async function handleGetSessions(req: Request, supabaseClient?: any) {
  if (req.method !== 'GET') return new Response(null, { status: 405 });
  const url = new URL(req.url);
  const user_id = url.searchParams.get('user_id');
  if (!user_id) return jsonResponse({ error: 'Missing user_id' }, 400);

  const supabase = supabaseClient ?? createSupabaseClient();
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user_id)
    .order('started_at', { ascending: false });

  if (error) return jsonResponse({ error: error.message }, 500);
  return jsonResponse({ sessions: data });
}

export default function (req: Request) {
  return handleGetSessions(req);
}
