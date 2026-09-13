import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export type CampaignRecord = {
  id: string;
  name: string;
  channel: string;
  description: string;
  scheduled_at: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
};

export async function requireAdminForCampaigns(supabase: SupabaseClient) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/login");
  }

  const user = userData.user;
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role ?? user.app_metadata?.role ?? "viewer";
  const allowed = ["admin", "super_admin", "administrator"].includes(String(role).toLowerCase());

  if (profileError || !allowed) {
    redirect("/dashboard");
  }

  return user;
}

export async function readCampaigns(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("campaigns")
    .select("id, name, channel, description, scheduled_at, status, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [] as CampaignRecord[], error };
  }

  return { data: data as CampaignRecord[], error: null };
}

export async function readCampaign(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("campaigns")
    .select("id, name, channel, description, scheduled_at, status, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { data: null as CampaignRecord | null, error };
  }

  return { data: data as CampaignRecord | null, error: null };
}
