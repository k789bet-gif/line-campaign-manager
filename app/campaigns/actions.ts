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
  const rawStartDate = String(formData.get("start_date") ?? "");
  const rawStartTime = String(formData.get("start_time") ?? "");
  const rawInterval = String(formData.get("interval_minutes") ?? "");

  return {
    name: String(formData.get("name") ?? ""),
    message_type: String(formData.get("message_type") ?? ""),
    text_content: String(formData.get("text_content") ?? ""),
    image_url: String(formData.get("image_url") ?? ""),
    flex_json: String(formData.get("flex_json") ?? ""),
    alt_text: String(formData.get("alt_text") ?? ""),
    start_date: rawStartDate.trim() ? rawStartDate : "",
    start_time: rawStartTime.trim() ? rawStartTime : "",
    interval_minutes: rawInterval.trim() ? rawInterval : "",
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
  const user = await requireAdminForCampaigns(supabase);

  const { error } = await supabase.from("campaigns").insert({
    user_id: user.id,
    name: parsed.data.name,
    message_type: parsed.data.message_type,
    text_content: parsed.data.text_content,
    image_url: parsed.data.image_url || null,
    flex_json: parsed.data.flex_json || null,
    alt_text: parsed.data.alt_text || null,
    start_date: parsed.data.start_date || null,
    start_time: parsed.data.start_time || null,
    interval_minutes: parsed.data.interval_minutes ? Number(parsed.data.interval_minutes) : null,
    status: parsed.data.status,
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
  const user = await requireAdminForCampaigns(supabase);

  const { error } = await supabase
    .from("campaigns")
    .update({
      name: parsed.data.name,
      message_type: parsed.data.message_type,
      text_content: parsed.data.text_content,
      image_url: parsed.data.image_url || null,
      flex_json: parsed.data.flex_json || null,
      alt_text: parsed.data.alt_text || null,
      start_date: parsed.data.start_date || null,
      start_time: parsed.data.start_time || null,
      interval_minutes: parsed.data.interval_minutes ? Number(parsed.data.interval_minutes) : null,
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/campaigns");
  redirect("/campaigns");
}

export async function deleteCampaignAction(id: string) {
  const supabase = await createServerSupabaseClient();
  const user = await requireAdminForCampaigns(supabase);

  const { error } = await supabase.from("campaigns").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    throw error;
  }

  revalidatePath("/campaigns");
  redirect("/campaigns");
}
