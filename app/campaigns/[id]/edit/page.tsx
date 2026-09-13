import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminForCampaigns, readCampaign } from "@/lib/campaigns/service";
import CampaignForm from "../../CampaignForm";
import { updateCampaignAction } from "../../actions";

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createServerSupabaseClient();
  await requireAdminForCampaigns(supabase);

  const { id } = await params;
  const { data: campaign, error } = await readCampaign(supabase, id);

  if (error || !campaign) {
    return <div className="form-alert error">ไม่พบบัญชีแคมเปญนี้</div>;
  }

  return (
    <div className="app-shell">
      <section className="campaign-form-page">
        <div className="page-topbar">
          <div>
            <span className="page-kicker">Campaign Management</span>
            <h1 className="page-title">แก้ไข Campaign</h1>
          </div>
        </div>
        <section className="campaign-form-card">
          <CampaignForm mode="edit" campaign={campaign} action={updateCampaignAction} />
        </section>
      </section>
    </div>
  );
}
