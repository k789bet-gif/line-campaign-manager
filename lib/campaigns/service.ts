import type { SupabaseClient } from "@supabase/supabase-js";

export type ProfileRecord = {
  id: string;
  role?: string | null;
  display_name?: string | null;
};

export type CampaignRecord = {
  id: string;
  name: string;
  description?: string | null;
  channel?: string | null;
  status?: string | null;
  scheduled_at?: string | null;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
  user_id?: string | null;
  message_type?: string | null;
  text_content?: string | null;
  image_url?: string | null;
  flex_json?: string | null;
  alt_text?: string | null;
  start_date?: string | null;
  start_time?: string | null;
  interval_minutes?: number | null;
  sent_count?: number | null;
  success_count?: number | null;
  failed_count?: number | null;
};

export type SupabaseErrorInfo = {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
  status?: number;
};

function toSafeSupabaseErrorInfo(error: unknown): SupabaseErrorInfo | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const candidate = error as {
    message?: string;
    code?: string;
    details?: string;
    hint?: string;
    status?: number;
  };

  if (!candidate.message) {
    return null;
  }

  return {
    message: candidate.message,
    code: candidate.code,
    details: candidate.details,
    hint: candidate.hint,
    status: candidate.status,
  };
}

function logSupabaseError(context: string, error: unknown) {
  const info = toSafeSupabaseErrorInfo(error);

  console.error(`[Supabase ${context}]`, {
    message: info?.message ?? "Unknown error",
    code: info?.code ?? null,
    details: info?.details ?? null,
    hint: info?.hint ?? null,
    status: info?.status ?? null,
  });
}

function buildSupabaseErrorMessage(context: string, error: unknown) {
  const info = toSafeSupabaseErrorInfo(error);

  if (!info) {
    return `${context}: Unknown Supabase error`;
  }

  const parts = [`${context}: ${info.message}`];
  if (info.code) parts.push(`code=${info.code}`);
  if (info.status) parts.push(`status=${info.status}`);
  if (info.details) parts.push(`details=${info.details}`);
  if (info.hint) parts.push(`hint=${info.hint}`);

  return parts.join(" | ");
}

export async function getCurrentUserProfile(supabase: SupabaseClient) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    logSupabaseError("auth.getUser", userError);
    throw new Error(buildSupabaseErrorMessage("Session user lookup failed", userError));
  }

  if (!userData.user) {
    throw new Error("No authenticated user found in session.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, display_name")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError) {
    logSupabaseError("profiles lookup", profileError);
    throw new Error(buildSupabaseErrorMessage("Profile lookup failed", profileError));
  }

  if (!profile) {
    return { user: userData.user, profile: null as ProfileRecord | null };
  }

  return { user: userData.user, profile: profile as ProfileRecord };
}

export async function getCampaignsForCurrentUser(supabase: SupabaseClient) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    logSupabaseError("auth.getUser for campaigns", userError);
    throw new Error(buildSupabaseErrorMessage("Campaign session lookup failed", userError));
  }

  if (!userData.user) {
    throw new Error("No authenticated user found in session for campaigns.");
  }

  const { data, error } = await supabase
    .from("campaigns")
    .select("id, name, description, channel, status, scheduled_at, created_by, created_at, updated_at")
    .eq("created_by", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseError("campaigns query", error);
    throw new Error(buildSupabaseErrorMessage("Campaign query failed", error));
  }

  return { user: userData.user, data: (data ?? []) as CampaignRecord[] };
}

export async function requireAdminForCampaigns(supabase: SupabaseClient) {
  const { user, profile } = await getCurrentUserProfile(supabase);

  if (!profile) {
    throw new Error("ยังไม่พบโปรไฟล์ผู้ใช้");
  }

  const roleName = String(profile.role ?? "viewer").toLowerCase();
  const allowed = ["viewer", "editor", "admin", "super_admin"].includes(roleName);

  if (!allowed) {
    throw new Error(`Campaign access is restricted to an authorized team role. Current role: ${roleName}`);
  }

  return user;
}

export async function readProfile(supabase: SupabaseClient, userId: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, display_name")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      logSupabaseError("readProfile", error);
      return { data: null as ProfileRecord | null, error: new Error(buildSupabaseErrorMessage("Unable to load the user profile", error)) };
    }

    return { data: data as ProfileRecord | null, error: null };
  } catch (cause) {
    logSupabaseError("readProfile catch", cause);
    return { data: null as ProfileRecord | null, error: new Error(buildSupabaseErrorMessage("Unable to load the user profile", cause)) };
  }
}

export async function readCampaigns(supabase: SupabaseClient) {
  try {
    const result = await getCampaignsForCurrentUser(supabase);

    return { data: result.data as CampaignRecord[], error: null, user: result.user };
  } catch (cause) {
    logSupabaseError("readCampaigns catch", cause);
    return {
      data: [] as CampaignRecord[],
      error: cause instanceof Error ? cause : new Error(buildSupabaseErrorMessage("Unable to load campaigns right now", cause)),
      user: null,
    };
  }
}

export async function readCampaign(supabase: SupabaseClient, id: string) {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select("id, name, description, channel, status, scheduled_at, created_by, created_at, updated_at")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      logSupabaseError("readCampaign", error);
      return { data: null as CampaignRecord | null, error: new Error(buildSupabaseErrorMessage("Unable to load the campaign right now", error)) };
    }

    return { data: data as CampaignRecord | null, error: null };
  } catch (cause) {
    logSupabaseError("readCampaign catch", cause);
    return { data: null as CampaignRecord | null, error: new Error(buildSupabaseErrorMessage("Unable to load the campaign right now", cause)) };
  }
}
