"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

export async function loginAction(_prevState: unknown, formData: FormData) {
  const payload = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const result = loginSchema.safeParse(payload);

  if (!result.success) {
    const issue = result.error.issues[0];
    return { error: issue.message };
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง" };
  }

  if (!data.session) {
    return { error: "ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง" };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
