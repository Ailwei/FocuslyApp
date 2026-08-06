import { createSupabaseClient, jsonResponse } from '../_shared.ts';
import type { CompleteSessionInput } from '../types.ts';
import { validateCompleteSessionInput } from '../validate.ts';

export async function handleCompleteSession(req: Request, supabaseClient?: any) {
  if (req.method !== 'PATCH' && req.method !== 'POST') return new Response(null, { status: 405 });
  const body = await req.json();
  const validation = validateCompleteSessionInput(body);
  if (validation.length) return jsonResponse({ error: validation.join(', ') }, 400);

  const { id, completed_at, notes } = body as CompleteSessionInput;

  const updates: any = { completed: true };
  if (completed_at) updates.completed_at = completed_at;
  if (notes) updates.notes = notes;

  const supabase = supabaseClient ?? createSupabaseClient();
  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return jsonResponse({ error: error.message }, 500);
  return jsonResponse({ session: data });
}

export default function (req: Request) {
  return handleCompleteSession(req);
}