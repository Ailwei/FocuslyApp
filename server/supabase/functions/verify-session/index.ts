import { jsonResponse } from '../_shared.ts';
import { getRequiredEnv } from '../env.ts';

export async function handleVerifySession(req: Request) {
  if (req.method !== 'POST') return new Response(null, { status: 405 });

  const authHeader = req.headers.get('Authorization') ?? '';
  let token = '';
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    try {
      const body = await req.json();
      token = body?.token ?? '';
    } catch (_) {
      token = '';
    }
  }

  if (!token) return jsonResponse({ error: 'Missing token' }, 400);

  const url = getRequiredEnv('SUPABASE_URL');
  const serviceKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');

  try {
    const res = await fetch(`${url}/auth/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: serviceKey,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return jsonResponse({ error: 'Invalid token', detail: text }, 401);
    }

    const user = await res.json();
    return jsonResponse({ user });
  } catch (err) {
    return jsonResponse({ error: (err as any).message ?? String(err) }, 500);
  }
}

export default function (req: Request) {
  return handleVerifySession(req);
}
