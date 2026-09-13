import { z } from "zod";

export const messageTypeOptions = ["text", "image", "flex"] as const;
export const statusOptions = ["draft", "scheduled", "running", "completed", "failed", "cancelled"] as const;

export const campaignSchema = z.object({
  name: z.string().trim().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร").max(120, "ชื่อต้องไม่เกิน 120 ตัวอักษร"),
  message_type: z.enum(messageTypeOptions),
  text_content: z.string().trim().min(1, "ข้อความต้องไม่ว่างเปล่า").max(2000, "ข้อความต้องไม่เกิน 2000 ตัวอักษร"),
  image_url: z.string().trim().optional().or(z.literal("")).transform((value) => (value ?? "").trim()),
  flex_json: z.string().trim().optional().or(z.literal("")).transform((value) => (value ?? "").trim()),
  alt_text: z.string().trim().optional().or(z.literal("")).transform((value) => (value ?? "").trim()),
  start_date: z.string().trim().optional().or(z.literal("")).refine((value) => {
    if (!value) return true;
    const date = new Date(`${value}T00:00:00`);
    return !Number.isNaN(date.getTime());
  }, "รูปแบบวันที่เริ่มส่งไม่ถูกต้อง"),
  start_time: z.string().trim().optional().or(z.literal("")).refine((value) => {
    if (!value) return true;
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
  }, "รูปแบบเวลาเริ่มส่งไม่ถูกต้อง"),
  interval_minutes: z.string().trim().optional().or(z.literal("")).refine((value) => {
    if (!value) return true;
    const minutes = Number(value);
    return Number.isInteger(minutes) && minutes >= 1 && minutes <= 10080;
  }, "ระยะเวลาในการส่งต้องอยู่ระหว่าง 1 ถึง 10080 นาที"),
  status: z.enum(statusOptions),
});

export type CampaignInput = z.infer<typeof campaignSchema>;
