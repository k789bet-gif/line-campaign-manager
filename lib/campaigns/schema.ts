import { z } from "zod";

export const channelOptions = ["LINE Official", "SMS", "Email", "Push"] as const;
export const statusOptions = ["draft", "scheduled", "running", "completed", "cancelled"] as const;

export const campaignSchema = z.object({
  name: z.string().trim().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร").max(120, "ชื่อต้องไม่เกิน 120 ตัวอักษร"),
  channel: z.enum(channelOptions),
  message: z.string().trim().min(1, "ข้อความต้องไม่ว่างเปล่า").max(500, "ข้อความต้องไม่เกิน 500 ตัวอักษร"),
  scheduled_at: z.string().min(1, "กรุณาระบุวันเวลาเริ่มส่ง").refine((value) => {
    const date = new Date(value);
    return !Number.isNaN(date.getTime());
  }, "รูปแบบวันเวลาเริ่มส่งไม่ถูกต้อง"),
  status: z.enum(statusOptions),
});

export type CampaignInput = z.infer<typeof campaignSchema>;
