import { supabase } from "@/api/supabaseClient";

export async function fetchBadges(userId: string) {
  const { data, error } = await supabase
    .from("badges")
    .select(`
      id,
      title,
      description,
      category,
      icon,
      user_badges!left(user_id)
    `)
    .eq("user_badges.user_id", userId);

  if (error) throw error;

  return (data ?? []).map((badge: any) => ({
    id: badge.id,
    title: badge.title,
    description: badge.description,
    category: badge.category,
    icon: badge.icon,
    unlocked: badge.user_badges?.length > 0,
  }));
}