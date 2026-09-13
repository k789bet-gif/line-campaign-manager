"use client";

import { useActionState } from "react";
import { CalendarDays, Megaphone, Save } from "lucide-react";
import { channelOptions, statusOptions } from "@/lib/campaigns/schema";
import type { CampaignRecord } from "@/lib/campaigns/service";
import type { CampaignActionState } from "./actions";

export default function CampaignForm({
  campaign,
  mode,
  action,
}: {
  campaign?: CampaignRecord | null;
  mode: "create" | "edit";
  action: (state: CampaignActionState, formData: FormData) => Promise<CampaignActionState>;
}) {
  const initialState: CampaignActionState = { error: "", fieldErrors: {} };
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form className="campaign-form" action={formAction}>
      {campaign?.id && (<input type="hidden" name="id" value={campaign.id} />)}

      <div className="campaign-form-grid">
        <div className="form-field full-width">
          <label htmlFor="name">ชื่อแคมเปญ</label>
          <input id="name" name="name" defaultValue={campaign?.name ?? ""} required placeholder="เช่น Promotion Launch" />
          {state.fieldErrors?.name && <span className="form-error">{state.fieldErrors.name}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="channel">ช่องทางการส่ง</label>
          <select id="channel" name="channel" defaultValue={campaign?.channel ?? "line"} required>
            {channelOptions.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          {state.fieldErrors?.channel && <span className="form-error">{state.fieldErrors.channel}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="status">สถานะ</label>
          <select id="status" name="status" defaultValue={campaign?.status ?? "draft"} required>
            {statusOptions.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          {state.fieldErrors?.status && <span className="form-error">{state.fieldErrors.status}</span>}
        </div>

        <div className="form-field full-width">
          <label htmlFor="description">ข้อความ</label>
          <textarea id="description" name="description" required defaultValue={campaign?.description ?? ""} rows={5} placeholder="รายละเอียดแคมเปญ"></textarea>
          {state.fieldErrors?.description && <span className="form-error">{state.fieldErrors.description}</span>}
        </div>

        <div className="form-field full-width">
          <label htmlFor="scheduled_at">วันเวลาเริ่มส่ง</label>
          <input id="scheduled_at" name="scheduled_at" type="datetime-local" defaultValue={campaign?.scheduled_at ? campaign.scheduled_at.slice(0, 16) : ""} />
          {state.fieldErrors?.scheduled_at && <span className="form-error">{state.fieldErrors.scheduled_at}</span>}
        </div>
      </div>

      {state.error && <div className="form-alert error">{state.error}</div>}

      <div className="campaign-form-actions">
        <button className="primary-button" type="submit" disabled={pending}>
          <Save size={16} /> {pending ? (mode === "create" ? "กำลังบันทึก..." : "กำลังบันทึก...") : (mode === "create" ? "สร้างแคมเปญ" : "บันทึกการแก้ไข")}
        </button>
        <a className="secondary-button" href="/campaigns">
          <CalendarDays size={16} /> กลับไปยังรายการ
        </a>
      </div>
    </form>
  );
}
