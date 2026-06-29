import { getAdminSupabase } from "@/lib/supabase";
import type { StoryPage } from "./types";

function mapStory(row: any): StoryPage {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name || "Story",
    active: row.active !== false,
    direction: row.direction || "rtl",
    theme: row.theme || "soft",
    screens: Array.isArray(row.screens) ? row.screens : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getStoryPages(): Promise<StoryPage[]> {
  const supabase = getAdminSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("custom_pages")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) return [];
  return (data || []).map(mapStory);
}

export async function getPublicStoryBySlug(slug: string): Promise<StoryPage | null> {
  const supabase = getAdminSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("custom_pages")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error || !data) return null;
  return mapStory(data);
}
