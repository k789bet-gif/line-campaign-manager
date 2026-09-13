import { redirect } from "next/navigation";
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChartNoAxesCombined,
  Clock3,
  FileText,
  Gauge,
  LayoutDashboard,
  LineChart,
  LogOut,
  MapPin,
  Megaphone,
  Menu,
  MessageCircle,
  Package,
  Plus,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true, href: "/dashboard" },
  { icon: Megaphone, label: "Campaigns", active: false, href: "/campaigns" },
  { icon: MessageCircle, label: "Messages", active: false, href: "/messages" },
  { icon: Users, label: "Members", active: false, href: "/members" },
  { icon: ChartNoAxesCombined, label: "Reports", active: false, href: "/reports" },
  { icon: Settings, label: "Settings", active: false, href: "/settings" },
];

const campaignTrend = [
  { name: "01", value: 64, color: "bg-emerald-400" },
  { name: "02", value: 82, color: "bg-green-500" },
  { name: "03", value: 68, color: "bg-lime-500" },
  { name: "04", value: 90, color: "bg-emerald-600" },
  { name: "05", value: 73, color: "bg-teal-500" },
  { name: "06", value: 87, color: "bg-green-600" },
  { name: "07", value: 78, color: "bg-emerald-500" },
];

const summaryCards = [
  { label: "Campaign ทั้งหมด", value: "24", meta: "8 กำลังดำเนินการ", icon: Megaphone, chip: "+12%", chipClass: "positive" },
  { label: "ส่งข้อความสำเร็จ", value: "18", meta: "2,840 messages", icon: CheckCircle2, chip: "+8%", chipClass: "positive" },
  { label: "รอดำเนินการ", value: "04", meta: "2 แคมเปญในคิว", icon: Clock3, chip: "Live", chipClass: "warning" },
  { label: "ส่งไม่สำเร็จ", value: "02", meta: "ตรวจสอบทันที", icon: X, chip: "Alert", chipClass: "neutral" },
];

const latestCampaigns = [
  { name: "Summer Launch", channel: "LINE Official", status: "ส่งข้อความสำเร็จ", sentAt: "13 Sep 2026, 10:00", owner: "Growth Team" },
  { name: "Member Rewards", channel: "SMS", status: "รอดำเนินการ", sentAt: "14 Sep 2026, 09:30", owner: "Retention Team" },
  { name: "Flash Sale", channel: "Email", status: "ส่งไม่สำเร็จ", sentAt: "14 Sep 2026, 11:45", owner: "Marketing Team" },
  { name: "VIP Welcome", channel: "LINE Official", status: "ส่งข้อความสำเร็จ", sentAt: "15 Sep 2026, 13:15", owner: "CRM Team" },
];

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  return (
    <div className="dashboard-app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-wrap">
            <span className="brand-mark"><Rocket size={22} /></span>
            <span className="brand-text">LINE Manager</span>
          </div>
          <button className="sidebar-close"><X size={18} /></button>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">AM</div>
          <div>
            <div className="profile-name">Admin Manager</div>
            <div className="profile-role">Super Admin</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a key={item.label} className={`nav-item ${item.active ? "active" : ""}`} href={item.href}> 
                <span className="nav-icon"><Icon size={19} /></span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <form action={logoutAction} className="logout-form">
            <button className="nav-item logout" type="submit">
              <span className="nav-icon"><LogOut size={19} /></span>
              <span>ออกจากระบบ</span>
            </button>
          </form>
        </div>
      </aside>

      <main className="main-content">
        <section className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu"><Menu size={20} /></button>
            <div>
              <div className="breadcrumb">ระบบจัดการ</div>
              <h1 className="page-title">Dashboard</h1>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="search-box">
              <Search size={16} />
              <input aria-label="ค้นหา" placeholder="ค้นหาแคมเปญ" />
            </div>
            <button className="icon-button">
              <Bell size={19} />
              <span className="badge-dot"></span>
            </button>
            <a className="add-button" href="/campaigns/new">
              <Plus size={16} />
              สร้าง Campaign
            </a>
          </div>
        </section>

        <section className="summary-grid">
          {summaryCards.map((item) => {
            const Icon = item.icon;
            return (
              <article className="summary-card" key={item.label}>
                <div className="summary-card-top">
                  <span className="summary-icon"><Icon size={20} /></span>
                  <span className={`summary-chip ${item.chipClass}`}>{item.chip}</span>
                </div>
                <div className="summary-label">{item.label}</div>
                <div className="summary-value">{item.value}</div>
                <div className="summary-meta">
                  <span>{item.meta}</span>
                  <span className="summary-arrow">↗</span>
                </div>
              </article>
            );
          })}
        </section>

        <section className="analytics-grid">
          <article className="panel span-2">
            <div className="panel-header">
              <div>
                <span className="panel-label">Performance Overview</span>
                <h2 className="panel-title">ประสิทธิภาพแคมเปญ</h2>
              </div>
              <div className="panel-controls">
                <button className="calendar-button"><Calendar size={15} /> 2026</button>
                <button className="icon-button small"><LineChart size={17} /></button>
              </div>
            </div>
            <div className="chart-area">
              <div className="chart-grid-lines">
                {[70, 50, 30, 10].map((line) => <div key={line} className="chart-line" />)}
              </div>
              <div className="chart-bars">
                {campaignTrend.map((bar) => (
                  <div key={bar.name} className="chart-column">
                    <div className="chart-bars-wrap">
                      <span className="bar-value" style={{ height: `${bar.value}%` }}></span>
                    </div>
                    <span className="bar-label">{bar.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="panel channel-panel">
            <div className="panel-header compact">
              <div>
                <span className="panel-label">Channel Mix</span>
                <h2 className="panel-title">ช่องทางสื่อ</h2>
              </div>
              <button className="icon-button small"><Megaphone size={17} /></button>
            </div>
            <div className="channel-list">
              <div className="channel-row">
                <div className="channel-label">
                  <span className="channel-swatch line"></span>
                  <span>LINE Official</span>
                </div>
                <span className="channel-percent">46%</span>
              </div>
              <div className="channel-row">
                <div className="channel-label">
                  <span className="channel-swatch market"></span>
                  <span>SMS</span>
                </div>
                <span className="channel-percent">29%</span>
              </div>
              <div className="channel-row">
                <div className="channel-label">
                  <span className="channel-swatch event"></span>
                  <span>Email</span>
                </div>
                <span className="channel-percent">17%</span>
              </div>
              <div className="channel-row">
                <div className="channel-label">
                  <span className="channel-swatch referral"></span>
                  <span>Push</span>
                </div>
                <span className="channel-percent">8%</span>
              </div>
            </div>
          </article>
        </section>

        <section className="dashboard-panel-row">
          <article className="panel dashboard-table-panel">
            <div className="panel-header compact">
              <div>
                <span className="panel-label">Campaign Status</span>
                <h2 className="panel-title">แคมเปญล่าสุด</h2>
              </div>
              <a className="icon-button small" href="/campaigns/new"><Plus size={17} /></a>
            </div>

            <div className="campaign-table-wrap">
              <table className="campaign-table">
                <thead>
                  <tr>
                    <th>ชื่อแคมเปญ</th>
                    <th>ช่องทาง</th>
                    <th>เวลาเริ่มส่ง</th>
                    <th>ทีม</th>
                    <th>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {latestCampaigns.map((campaign) => (
                    <tr key={campaign.name}>
                      <td><strong>{campaign.name}</strong></td>
                      <td>{campaign.channel}</td>
                      <td>{campaign.sentAt}</td>
                      <td>{campaign.owner}</td>
                      <td>
                        <span className={`campaign-status ${campaign.status === "ส่งข้อความสำเร็จ" ? "successful" : campaign.status === "รอดำเนินการ" ? "running" : campaign.status === "ส่งไม่สำเร็จ" ? "failed" : "draft"}`}>{campaign.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <section className="bottom-grid">
          <article className="panel">
            <div className="panel-header compact">
              <div>
                <span className="panel-label">Team Activity</span>
                <h2 className="panel-title">กิจกรรมล่าสุด</h2>
              </div>
              <button className="icon-button small"><FileText size={17} /></button>
            </div>
            <div className="activity-list">
              <div className="activity-row">
                <span className="activity-icon success"><CheckCircle2 size={15} /></span>
                <div>
                  <span className="activity-title">Summer Launch อัปเดต Landing Page</span>
                  <small>08:45 น. • Admin Team</small>
                </div>
              </div>
              <div className="activity-row">
                <span className="activity-icon info"><LineChart size={15} /></span>
                <div>
                  <span className="activity-title">รายงาน Conversion ประจำวัน</span>
                  <small>11:20 น. • Growth Team</small>
                </div>
              </div>
              <div className="activity-row">
                <span className="activity-icon map"><MapPin size={15} /></span>
                <div>
                  <span className="activity-title">หมวดหมู่ Store Location updated</span>
                  <small>14:10 น. • Operation Team</small>
                </div>
              </div>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header compact">
              <div>
                <span className="panel-label">Operations</span>
                <h2 className="panel-title">สรุปวัน</h2>
              </div>
              <button className="icon-button small"><Gauge size={17} /></button>
            </div>
            <div className="quick-metrics">
              <div className="quick-metric">
                <span className="metric-number">18</span>
                <span className="metric-label">การส่งข้อความ</span>
              </div>
              <div className="quick-metric">
                <span className="metric-number">2.8k</span>
                <span className="metric-label">ข้อความตอบกลับ</span>
              </div>
              <div className="quick-metric">
                <span className="metric-number">96%</span>
                <span className="metric-label">ระบบออนไลน์</span>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
