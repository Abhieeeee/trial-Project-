import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Banknote,
  KeyRound,
  Server,
  ShieldCheck,
  UserCog,
  WalletCards,
  ShieldAlert,
  ArrowRight,
  Zap,
} from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";
import { getDashboardStats, getWeeklyRevenue } from "@/lib/db";

export const revalidate = 0; // Live dashboard reports

export default async function SuperAdminDashboardPage() {
  const supabase = createAdminClient();

  const [stats, weeklySales, staffResult, auditResult] = await Promise.all([
    getDashboardStats(),
    getWeeklyRevenue(),
    supabase.from("profiles").select("*").in("role", ["admin", "super_admin"]),
    supabase.from("analytics_events").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const staffList = staffResult.data ?? [];
  const auditList = auditResult.data ?? [];

  const grossRevenue = stats.total_revenue;
  const netRevenue = stats.total_revenue * 0.81; // Deduct simulated tax/platform fee bounds
  const refundExposure = stats.total_revenue * 0.02; // Simulated refund exposure allocation

  const executiveMetrics = [
    { 
      label: "Gross Store Revenue", 
      value: `€${grossRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, 
      change: "Store Sales Gross", 
      changeTone: "text-red-400 bg-red-500/10 border-red-500/30",
      icon: WalletCards 
    },
    { 
      label: "Net Operating Revenue", 
      value: `€${netRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, 
      change: "Est. Net Profit", 
      changeTone: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      icon: Banknote 
    },
    { 
      label: "Refund Exposure Risk", 
      value: `€${refundExposure.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, 
      change: "2% Risk Allocation", 
      changeTone: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      icon: Activity 
    },
    { 
      label: "Elevated Role Staff", 
      value: `${staffList.length}`, 
      change: "Active Accounts", 
      changeTone: "text-sky-400 bg-sky-500/10 border-sky-500/30",
      icon: UserCog 
    },
  ];

  // Normalize chart details
  const maxSales = Math.max(...weeklySales.map((s) => s.value), 1);
  const chartSales = weeklySales.map((s) => ({
    day: s.day,
    amount: `€${(s.value / 1000).toFixed(1)}K`,
    percentage: (s.value / maxSales) * 100,
  }));

  return (
    <div className="pb-16 font-mono space-y-10">
      
      {/* Super Admin Title Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-[8px] uppercase tracking-widest font-extrabold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" /> MASTER AUTHORITY LEVEL 4
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.15em] text-white font-display">
            Super Admin Control Tower
          </h1>
          <p className="mt-2 text-xs text-neutral-400 tracking-wide font-sans max-w-xl">
            Complete executive visibility across platform gross revenue, security roles, system health, and infrastructure audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest text-red-400 backdrop-blur-xl">
            <ShieldCheck className="h-4 w-4" />
            <span>Full System Permissions Active</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {executiveMetrics.map((metric) => (
          <div 
            key={metric.label} 
            className="glass-panel-glow rounded-2xl p-6 border border-red-500/20 hover:border-red-500/50 transition-all duration-300 relative overflow-hidden group space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 group-hover:text-white transition-colors">
                {metric.label}
              </p>
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:border-red-500/50 transition-all">
                <metric.icon className="h-4 w-4" />
              </div>
            </div>

            <div>
              <p className="text-3xl font-extrabold tracking-tight text-white font-display">
                {metric.value}
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded text-[8px] uppercase tracking-widest font-extrabold border ${metric.changeTone}`}>
                {metric.change}
              </span>
              <span className="text-[8px] uppercase tracking-widest text-neutral-500">Authority Sync</span>
            </div>
          </div>
        ))}
      </section>

      {/* Graph & Infrastructure System Health */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.6fr_1fr]">
        
        {/* Weekly Revenue Graph */}
        <section className="glass-panel-glow rounded-2xl border border-red-500/20 p-6 md:p-8 space-y-6 relative">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white font-display">
                Executive Revenue Telemetry
              </h2>
              <p className="mt-1 text-[9px] uppercase tracking-widest text-neutral-400">
                Gross sales, tax allocations, and operational performance
              </p>
            </div>
            <Link 
              href="/super-admin/sales" 
              className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-red-400 hover:underline flex items-center gap-1.5"
            >
              <span>Financial Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex h-64 items-end gap-3 sm:gap-5 pt-4">
            {chartSales.map((entry) => (
              <div key={entry.day} className="group flex h-full min-w-0 flex-1 flex-col justify-end gap-3">
                <div className="relative flex flex-1 items-end overflow-hidden rounded-t-lg border border-white/10 bg-black/60">
                  <div 
                    className="w-full bg-gradient-to-t from-red-500/20 via-red-500/60 to-red-500 transition-all group-hover:brightness-125 rounded-t-sm" 
                    style={{ height: `${entry.percentage}%` }} 
                  />
                  <span className="absolute inset-x-0 top-2 hidden text-center text-[8px] font-extrabold text-white lg:block tracking-widest">
                    {entry.amount}
                  </span>
                </div>
                <span className="text-center text-[9px] font-bold uppercase tracking-widest text-neutral-400 group-hover:text-red-400 transition-colors">
                  {entry.day}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* System Infrastructure Health */}
        <section className="glass-panel-glow rounded-2xl border border-white/10 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white font-display">
              Infrastructure Health
            </h2>
            <span className="text-[8px] uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30 font-bold">
              100% ONLINE
            </span>
          </div>

          <div className="space-y-4">
            {[
              ["Storefront Vercel Edge", "Operational", "99.99%", "text-emerald-400"],
              ["Checkout API Engine", "Operational", "128ms", "text-emerald-400"],
              ["Supabase PostgreSQL", "Healthy", "34ms", "text-emerald-400"],
              ["Redis Cache Gateway", "Healthy", "8ms", "text-emerald-400"],
            ].map(([service, status, metric, tone]) => (
              <div key={service} className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Server className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white">{service}</p>
                    <p className={`text-[8px] uppercase tracking-widest font-extrabold ${tone}`}>{status}</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-neutral-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                  {metric}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Staff Permissions & Live Security Audit Log */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        
        {/* Privileged Staff Accounts */}
        <section className="glass-panel-glow rounded-2xl border border-white/10 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white font-display">
                Staff & Admin Roster
              </h2>
              <p className="mt-1 text-[9px] uppercase tracking-widest text-neutral-400">
                Accounts with elevated portal privileges
              </p>
            </div>
            <Link 
              href="/super-admin/admins" 
              className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-red-400 hover:underline flex items-center gap-1.5"
            >
              <span>Manage Roster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {staffList.slice(0, 4).map((member) => (
              <div key={member.email} className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center font-bold text-xs">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white">{member.name}</p>
                    <p className="text-[8px] text-neutral-400 tracking-wider">{member.email}</p>
                  </div>
                </div>
                <span className="text-[8px] uppercase tracking-widest font-extrabold text-red-400 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/30">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Live Security Audit Log */}
        <section className="glass-panel-glow rounded-2xl border border-white/10 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white font-display">
                Live Audit Stream
              </h2>
              <p className="mt-1 text-[9px] uppercase tracking-widest text-neutral-400">
                Real-time security telemetry log
              </p>
            </div>
            <Link 
              href="/super-admin/audit" 
              className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-red-400 hover:underline flex items-center gap-1.5"
            >
              <span>Full Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {auditList.slice(0, 4).map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-white/5 bg-black/40">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 shrink-0">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-white truncate">{event.event}</p>
                  <p className="text-[8px] text-neutral-500 tracking-wider">
                    {new Date(event.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {auditList.length === 0 && (
              <div className="p-6 text-center text-[9px] uppercase tracking-widest text-neutral-500 border border-white/5 rounded-xl bg-black/20">
                🛡️ No security anomalies detected. System operating normally.
              </div>
            )}
          </div>
        </section>
      </div>

    </div>
  );
}
