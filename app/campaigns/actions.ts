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
  return {
    name: String(formData.get("name") ?? ""),
    channel: String(formData.get("channel") ?? ""),
    message: String(formData.get("message") ?? ""),
    scheduled_at: String(formData.get("scheduled_at") ?? ""),
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

  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase.from("campaigns").insert({
    ...parsed.data,
    created_by: userData.user?.id,
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

  const { error } = await supabase
    .from("campaigns")
    .update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/campaigns");
  redirect("/campaigns");
}

export async function deleteCampaignAction(id: string) {
  const supabase = await createServerSupabaseClient();
  await requireAdminForCampaigns(supabase);

  const { error } = await supabase.from("campaigns").delete().eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/campaigns");
  redirect("/campaigns");
}
