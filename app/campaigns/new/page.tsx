import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminForCampaigns } from "@/lib/campaigns/service";
import CampaignForm from "../CampaignForm";
import { createCampaignAction } from "../actions";

export default async function NewCampaignPage() {
  try {
    const supabase = await createServerSupabaseClient();
    await requireAdminForCampaigns(supabase);

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
  } catch (error) {
    const message = error instanceof Error && error.message === "ยังไม่พบโปรไฟล์ผู้ใช้" ? "ยังไม่พบโปรไฟล์ผู้ใช้" : "ไม่สามารถโหลดหน้าสร้าง Campaign ได้";
    return <div className="form-alert error">{message}</div>;
  }
}
