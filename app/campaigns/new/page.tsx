import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminForCampaigns } from "@/lib/campaigns/service";
import CampaignForm from "../CampaignForm";
import { createCampaignAction } from "../actions";

export default async function NewCampaignPage() {
  const supabase = await createServerSupabaseClient();
  const user = await requireAdminForCampaigns(supabase);
  if (!user) redirect("/dashboard");

  return (
    <div className="app-shell">
      <section className="campaign-form-page">
        <div className="page-topbar">
          <div>
            <span className="page-kicker">Campaign Management</span>
            <h1 className="page-title">สร้าง Campaign ใหม่</h1>
          </div>
        </div>
        <section className="campaign-form-card">
          <CampaignForm mode="create" action={createCampaignAction} />
        </section>
      </section>
    </div>
  );
}
