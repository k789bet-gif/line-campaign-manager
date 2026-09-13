"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { campaignSchema } from "@/lib/campaigns/schema";
import { requireAdminForCampaigns } from "@/lib/campaigns/service";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type CampaignActionState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
};

function toPayload(formData: FormData) {
  const rawSchedule = String(formData.get("scheduled_at") ?? "");
  return {
    name: String(formData.get("name") ?? ""),
    channel: String(formData.get("channel") ?? ""),
    description: String(formData.get("description") ?? ""),
    scheduled_at: rawSchedule.trim() ? rawSchedule : "",
    status: String(formData.get("status") ?? ""),
  };
}

export async function createCampaignAction(_prevState: CampaignActionState, formData: FormData): Promise<CampaignActionState> {
  const payload = toPayload(formData);
  const parsed = campaignSchema.safeParse(payload);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: issue.message, fieldErrors: { [issue.path[0] ?? "form"]: issue.message } };
  }

  const supabase = await createServerSupabaseClient();
  await requireAdminForCampaigns(supabase);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user?.id) {
    return { error: "Authentication required to create campaign." };
  }

  const { error } = await supabase.from("campaigns").insert({
    ...parsed.data,
    scheduled_at: parsed.data.scheduled_at ? new Date(parsed.data.scheduled_at).toISOString() : null,
    created_by: userData.user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/campaigns");
  redirect("/campaigns");
}

export async function updateCampaignAction(_prevState: CampaignActionState, formData: FormData): Promise<CampaignActionState> {
  const id = String(formData.get("id") ?? "");
  const payload = toPayload(formData);
  const parsed = campaignSchema.safeParse(payload);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: issue.message, fieldErrors: { [issue.path[0] ?? "form"]: issue.message } };
  }

  const supabase = await createServerSupabaseClient();
  await requireAdminForCampaigns(supabase);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user?.id) {
    return { error: "Authentication required to edit campaign." };
  }

  const { error } = await supabase
    .from("campaigns")
    .update({
      name: parsed.data.name,
      channel: parsed.data.channel,
      description: parsed.data.description,
      scheduled_at: parsed.data.scheduled_at ? new Date(parsed.data.scheduled_at).toISOString() : null,
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("created_by", userData.user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/campaigns");
  redirect("/campaigns");
}

export async function deleteCampaignAction(id: string) {
  const supabase = await createServerSupabaseClient();
  await requireAdminForCampaigns(supabase);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user?.id) {
    throw new Error("Authentication required to delete campaign.");
  }

  const { error } = await supabase.from("campaigns").delete().eq("id", id).eq("created_by", userData.user.id);

  if (error) {
    throw error;
  }

  revalidatePath("/campaigns");
  redirect("/campaigns");
}
