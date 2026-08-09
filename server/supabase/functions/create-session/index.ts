import { createSupabaseClient, jsonResponse } from '../_shared.ts';
import type { CreateSessionInput } from '../types.ts';
import { validateCreateSessionInput } from '../validate.ts';
import { getRequiredEnv } from '../env.ts';
import { checkBadges } from '../check-badges/index.ts';

interface DistractionInput {
  leftAt: string;
  returnedAt: string | null;
  durationSeconds: number | null;
}

async function handleCreateSession(req: Request, supabaseClient?: any) {
  console.log("HANDLE START");

  if (req.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  let body: any = {};

  try {
    body = await req.json();
  } catch (error) {
    console.log("BODY PARSE ERROR", error);
    body = {};
  }

  console.log("create-session body:", body);

  const authHeader = req.headers.get('Authorization') ?? '';

  let token = '';

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    token = body?.token ?? '';
  }

  console.log("TOKEN EXISTS:", !!token);

  if (!token) {
    return jsonResponse(
      { error: 'Missing token' },
      400
    );
  }

  const url = getRequiredEnv('SUPABASE_URL');
  const serviceKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');

  console.log("SUPABASE URL:", url);

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  let userRes: Response;

  try {
    userRes = await fetch(`${url}/auth/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: serviceKey,
      },
      signal: controller.signal,
    });
  } catch (error) {
    console.log("AUTH FETCH FAILED:", error);

    return jsonResponse(
      {
        error: 'Auth request failed',
        details: String(error)
      },
      500
    );
  } finally {
    clearTimeout(timeout);
  }

  console.log("AUTH STATUS:", userRes.status);

  if (!userRes.ok) {
    const text = await userRes.text();

    console.log("AUTH ERROR:", text);

    return jsonResponse(
      {
        error: 'Invalid token',
        detail: text
      },
      401
    );
  }

  const userJson = await userRes.json();

  const userId = userJson?.id ?? userJson?.user?.id;

  console.log("AUTH USER:", userId);

  if (!userId) {
    return jsonResponse(
      { error: 'Unable to determine user id' },
      401
    );
  }

  body.user_id = userId;

  const {
    user_id,
    task,
    duration_minutes,
    completed_at
  } = body as CreateSessionInput;

  const distractions: DistractionInput[] = Array.isArray(body.distractions)
    ? body.distractions
    : [];

  const validation = validateCreateSessionInput(body);

  console.log("VALIDATION:", validation);

  if (validation.length) {
    return jsonResponse(
      { error: validation.join(', ') },
      400
    );
  }

  const supabase = supabaseClient ?? createSupabaseClient();

  console.log("INSERTING SESSION:", {
    user_id,
    task,
    duration_minutes,
    completed_at,
    distraction_count: distractions.length,
  });

  const { data, error } = await supabase
    .from("sessions")
    .insert([
      {
        user_id,
        task,
        duration_minutes,
        completed_at,
        distraction_count: distractions.length,
      },
    ])
    .select()
    .single();

  console.log("Inserted session:", data);
  console.log("Insert error:", error);

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  if (distractions.length > 0) {
    const distractionRows = distractions.map((d) => ({
      session_id: data.id,
      user_id,
      left_at: d.leftAt,
      returned_at: d.returnedAt,
      duration_seconds: d.durationSeconds,
    }));

    const { error: distractionError } = await supabase
      .from("session_distractions")
      .insert(distractionRows);

    console.log("Distraction insert error:", distractionError);

    if (distractionError) {
      console.error("Failed to insert distractions, session still saved:", distractionError);
    }
  }

  const unlockedBadges = await checkBadges(userId, supabase);

  console.log("Unlocked badges:", unlockedBadges);

  return jsonResponse(
    {
      session: data,
      badges: unlockedBadges,
    },
    201
  );
}

Deno.serve(async (req: Request) => {
  console.log("CREATE SESSION REQUEST RECEIVED");

  try {
    return await handleCreateSession(req);
  } catch (error) {
    console.error("FUNCTION CRASH:", error);

    return jsonResponse(
      { error: String(error) },
      500
    );
  }
});