"use client";

import { useActionState } from "react";
import { CalendarDays, Megaphone, Save } from "lucide-react";
import { messageTypeOptions, statusOptions } from "@/lib/campaigns/schema";
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
          <label htmlFor="message_type">ประเภทข้อความ</label>
          <select id="message_type" name="message_type" defaultValue={campaign?.message_type ?? "text"} required>
            {messageTypeOptions.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          {state.fieldErrors?.message_type && <span className="form-error">{state.fieldErrors.message_type}</span>}
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
          <label htmlFor="text_content">ข้อความ</label>
          <textarea id="text_content" name="text_content" required defaultValue={campaign?.text_content ?? ""} rows={5} placeholder="รายละเอียดแคมเปญ"></textarea>
          {state.fieldErrors?.text_content && <span className="form-error">{state.fieldErrors.text_content}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="image_url">URL รูปภาพ</label>
          <input id="image_url" name="image_url" type="url" defaultValue={campaign?.image_url ?? ""} placeholder="https://example.com/image.jpg" />
        </div>

        <div className="form-field">
          <label htmlFor="alt_text">คำอธิบายรูปภาพ</label>
          <input id="alt_text" name="alt_text" defaultValue={campaign?.alt_text ?? ""} placeholder="คำอธิบายประกอบภาพ" />
        </div>

        <div className="form-field">
          <label htmlFor="start_date">วันที่เริ่มส่ง</label>
          <input id="start_date" name="start_date" type="date" defaultValue={campaign?.start_date ?? ""} />
          {state.fieldErrors?.start_date && <span className="form-error">{state.fieldErrors.start_date}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="start_time">เวลาเริ่มส่ง</label>
          <input id="start_time" name="start_time" type="time" defaultValue={campaign?.start_time ?? ""} />
          {state.fieldErrors?.start_time && <span className="form-error">{state.fieldErrors.start_time}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="interval_minutes">ทุกกี่นาที</label>
          <input id="interval_minutes" name="interval_minutes" type="number" min="1" max="10080" defaultValue={campaign?.interval_minutes ?? 15} />
          {state.fieldErrors?.interval_minutes && <span className="form-error">{state.fieldErrors.interval_minutes}</span>}
        </div>

        <div className="form-field full-width">
          <label htmlFor="flex_json">Flex JSON</label>
          <textarea id="flex_json" name="flex_json" defaultValue={campaign?.flex_json ?? ""} rows={5} placeholder={'{ "type": "bubble" }'}></textarea>
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
