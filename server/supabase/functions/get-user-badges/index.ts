import { createSupabaseClient, jsonResponse } from '../_shared.ts';

export async function handleGetUserBadges(
  req: Request,
  supabaseClient?: any
) {

  if (req.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  const supabase = supabaseClient ?? createSupabaseClient();

  try {
    const authHeader = req.headers.get('Authorization') ?? '';

    if (!authHeader.startsWith('Bearer ')) {
      return jsonResponse({ error: 'Missing authorization token' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');

    const { data: userData, error: authError } = await supabase.auth.getUser(token);


    if (authError || !userData?.user) {
      return jsonResponse({ error: 'Invalid token' }, 401);
    }

    const userId = userData.user.id;

    const userBadgesRes = await supabase
      .from('user_badges')
      .select('badge_id, unlocked_at, badges(id, title, description, category, icon)')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });


    if (userBadgesRes.error) {
      console.error('USER BADGES QUERY ERROR:', userBadgesRes.error);
      return jsonResponse({ error: 'Failed to load badges' }, 500);
    }

    const badges = (userBadgesRes.data ?? []).map((row: any) => ({
      id: row.badges.id,
      title: row.badges.title,
      description: row.badges.description,
      category: row.badges.category,
      icon: row.badges.icon,
      unlocked: true,
      unlockedAt: row.unlocked_at,
    }));

    return jsonResponse({ badges }, 200);
  } catch (error: any) {
    console.error('GET USER BADGES ERROR:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

Deno.serve((req) => handleGetUserBadges(req));