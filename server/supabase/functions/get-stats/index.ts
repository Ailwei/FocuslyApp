import { createSupabaseClient, jsonResponse } from '../_shared.ts';

export async function handleGetStats(req: Request, supabaseClient?: any) {
  if (req.method !== 'GET') return new Response(null, { status: 405 });
  const url = new URL(req.url);
  const user_id = url.searchParams.get('user_id');
  if (!user_id) return jsonResponse({ error: 'Missing user_id' }, 400);

  const supabase = supabaseClient ?? createSupabaseClient();
  const totalQ = await supabase.from('sessions').select('id', { count: 'exact' }).eq('user_id', user_id);
  const completedQ = await supabase.from('sessions').select('id', { count: 'exact' }).eq('user_id', user_id).eq('completed', true);
  const avgQ = await supabase.rpc('avg_session_duration', { p_user_id: user_id }).catch(() => ({ data: null }));

  return jsonResponse({
    total: totalQ.count ?? 0,
    completed: completedQ.count ?? 0,
    avg_duration: avgQ.data ?? null,
  });
}

export default function (req: Request) {
  return handleGetStats(req);
}
