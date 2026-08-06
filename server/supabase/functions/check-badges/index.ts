import { createSupabaseClient } from "../_shared.ts";

export async function checkBadges(
  userId: string,
  supabaseClient?: any
) {
  const supabase = supabaseClient ?? createSupabaseClient();

  // Get all sessions
  const { data: sessions, error: sessionError } = await supabase
    .from("sessions")
    .select("duration_minutes")
    .eq("user_id", userId);

  if (sessionError) throw sessionError;

  const sessionCount = sessions.length;
  const totalMinutes = sessions.reduce(
    (sum: number, session: any) => sum + session.duration_minutes,
    0
  );

  // Longest session
  const longestSession =
    sessions.length === 0
      ? 0
      : Math.max(...sessions.map((s: any) => s.duration_minutes));

  // Load all badge definitions
  const { data: badges, error: badgeError } = await supabase
    .from("badges")
    .select("*");

  if (badgeError) throw badgeError;

  const unlocked: any[] = [];

  for (const badge of badges) {
    let earned = false;

    switch (badge.rule_type) {
      case "sessions_count":
        earned = sessionCount >= badge.rule_value;
        break;

      case "total_minutes":
        earned = totalMinutes >= badge.rule_value;
        break;

      case "session_duration":
        earned = longestSession >= badge.rule_value;
        break;
    }

    if (!earned) continue;

    const { error } = await supabase
      .from("user_badges")
      .insert({
        user_id: userId,
        badge_id: badge.id,
      });

    // Ignore duplicate unlocks
    if (!error) {
      unlocked.push(badge);
    }
  }

  return unlocked;
}