import { supabase } from "@/api/supabaseClient";
import { Badge } from "@/types/models";

export async function fetchBadges(): Promise<Badge[]> {
  const {
    data: sessionData,
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  const token = sessionData.session?.access_token;

  if (!token) {
    throw new Error("No authenticated session");
  }

  const { data, error } = await supabase.functions.invoke("get-user-badges", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (error) throw error;

  return (data?.badges ?? []).map((badge: any) => ({
    id: badge.id,
    title: badge.title,
    category: badge.category,
    unlocked: badge.unlocked,
  }));
}