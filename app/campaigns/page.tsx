import Link from "next/link";
import { Calendar, Megaphone, Pencil, Trash2 } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminForCampaigns, readCampaigns } from "@/lib/campaigns/service";
import { deleteCampaignAction } from "./actions";

export default async function CampaignsPage() {
  const supabase = await createServerSupabaseClient();
  await requireAdminForCampaigns(supabase);

  const { data, error } = await readCampaigns(supabase);

  return (
    <div className="app-shell">
      <section className="campaigns-page">
        <div className="page-topbar">
          <div>
            <span className="page-kicker">Campaign Management</span>
            <h1 className="page-title">แคมเปญ</h1>
          </div>
          <div className="page-actions">
            <Link className="primary-button" href="/campaigns/new">
              <Megaphone size={16} /> สร้าง Campaign ใหม่
            </Link>
          </div>
        </div>

        {error ? <div className="form-alert error">{error.message}</div> : null}

        <section className="campaign-list-card">
          <div className="campaign-list-head">
            <span>รายการแคมเปญ</span>
            <span className="campaign-count">{data.length} รายการ</span>
          </div>

          {data.length === 0 ? (
            <div className="empty-state">
              <Megaphone size={34} />
              <p>ยังไม่มีแคมเปญในระบบ</p>
              <Link className="primary-button" href="/campaigns/new">เพิ่มแคมเปญ</Link>
            </div>
          ) : (
            <div className="campaign-list">
              {data.map((campaign) => (
                <article className="campaign-row" key={campaign.id}>
                  <div className="campaign-main">
                    <span className="campaign-icon"><Megaphone size={16} /></span>
                    <div>
                      <div className="campaign-title">{campaign.name}</div>
                      <div className="campaign-meta">
                        <span>{campaign.channel}</span>
                        <span className="separator">•</span>
                        <span>{campaign.status}</span>
                        <span className="separator">•</span>
                        <span><Calendar size={14} /> {campaign.scheduled_at ? new Date(campaign.scheduled_at).toLocaleString("th-TH") : "ยังไม่กำหนดเวลา"}</span>
                      </div>
                      <div className="campaign-message">{campaign.description}</div>
                    </div>
                  </div>

                  <div className="campaign-controls">
                    <Link className="icon-button small" href={`/campaigns/${campaign.id}/edit`} aria-label="แก้ไข">
                      <Pencil size={16} />
                    </Link>
                    <form action={deleteCampaignAction.bind(null, campaign.id)}>
                      <button className="icon-button danger small" type="submit" aria-label="ลบ">
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
