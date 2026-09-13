"use client";

import { useActionState } from "react";
import { KeyRound, LockKeyhole, Rocket, ShieldCheck } from "lucide-react";
import { loginAction } from "./actions";

const initialState = { error: "" };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-orbit orbit-one"></div>
        <div className="login-orbit orbit-two"></div>
      </div>

      <div className="login-shell">
        <section className="login-brand-panel">
          <div className="login-brand-top">
            <span className="login-logo">
              <Rocket size={32} />
            </span>
            <span className="login-brand-name">LINE Manager</span>
          </div>

          <div className="login-brand-content">
            <div className="login-kicker">Campaign Control</div>
            <h1>LINE Campaign Manager</h1>
            <p>
              จัดการแคมเปญ แก้ไขสมาชิก และติดตามผลลัพธ์ของทีมงานอย่างครบถ้วน
            </p>
          </div>

          <div className="login-feature-list">
            <div className="login-feature">
              <ShieldCheck size={18} />
              <span>ระบบรักษาความปลอดภัย</span>
            </div>
            <div className="login-feature">
              <Rocket size={18} />
              <span>แคมเปญที่ปรับปรุงได้จริง</span>
            </div>
            <div className="login-feature">
              <KeyRound size={18} />
              <span>เข้าใช้งานด้วยสิทธิ์ผู้ดูแล</span>
            </div>
          </div>

          <div className="login-brand-footer">
            <span className="pulse-dot"></span>
            <span>ระบบออนไลน์</span>
          </div>
        </section>

        <section className="login-card-wrap">
          <div className="login-card">
            <div className="login-card-header">
              <div>
                <span className="login-label">ยินดีต้อนรับ</span>
                <h2>เข้าสู่ระบบ</h2>
              </div>
              <span className="login-icon">
                <LockKeyhole size={24} />
              </span>
            </div>

            <form className="login-form" action={formAction}>
              <div className="form-field">
                <label htmlFor="email">อีเมลผู้ดูแล</label>
                <input id="email" name="email" type="email" autoComplete="email" required placeholder="admin@domain.com" />
              </div>

              <div className="form-field">
                <label htmlFor="password">รหัสผ่าน</label>
                <input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
              </div>

              <div className="login-options">
                <label className="remember">
                  <input type="checkbox" />
                  <span>จดจำการเข้าสู่ระบบ</span>
                </label>
                <a href="#">ลืมรหัสผ่าน?</a>
              </div>

              {state?.error ? <div className="login-error-message">{state.error}</div> : null}

              <button className="login-button" disabled={pending}>
                <span>{pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}</span>
                <Rocket size={16} />
              </button>

              <div className="login-divider">
                <span>หรือ</span>
              </div>

              <button className="login-secondary" type="button">
                เข้าสู่ระบบด้วย Supabase
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
