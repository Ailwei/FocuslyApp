import { createSupabaseClient } from "../_shared.ts";

export async function checkBadges(
  userId: string,
  supabaseClient?: any
) {
  const supabase = supabaseClient ?? createSupabaseClient();

  const { data: sessions, error: sessionError } = await supabase
    .from("sessions")
    .select("duration_minutes, completed_at")
    .eq("user_id", userId);

  if (sessionError) throw sessionError;

  const sessionCount = sessions.length;

  const totalMinutes = sessions.reduce(
    (sum: number, session: any) => sum + session.duration_minutes,
    0
  );

  const longestSession =
    sessions.length === 0
      ? 0
      : Math.max(...sessions.map((s: any) => s.duration_minutes));

  const activeDays = new Set(
    sessions.map((s: any) => new Date(s.completed_at).toISOString().slice(0, 10))
  ).size;

  const { data: badges, error: badgeError } = await supabase
    .from("badges")
    .select("*");

  if (badgeError) throw badgeError;

  const { data: existingUserBadges, error: existingError } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId);

  if (existingError) throw existingError;

  const alreadyUnlocked = new Set(
    (existingUserBadges ?? []).map((ub: any) => ub.badge_id)
  );

  const unlocked: any[] = [];

  for (const badge of badges) {
    if (alreadyUnlocked.has(badge.id)) continue;

    let earned = false;

    switch (badge.rule_type) {
      case "sessions_count":
        earned = sessionCount >= badge.rule_value;
        break;

      case "total_minutes":
        earned = totalMinutes >= badge.rule_value;
        break;

      case "longest_session":
        earned = longestSession >= badge.rule_value;
        break;

      case "active_days":
        earned = activeDays >= badge.rule_value;
        break;
    }

    if (!earned) continue;

    const { error } = await supabase
      .from("user_badges")
      .insert({
        user_id: userId,
        badge_id: badge.id,
      });

    if (!error) {
      unlocked.push(badge);
    }
  }

  return unlocked;
}