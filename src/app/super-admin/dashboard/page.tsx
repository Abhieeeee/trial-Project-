"use client";

import { motion } from "framer-motion";
import {
  TrendingUp, ShoppingBag, Users, AlertTriangle,
  ArrowUpRight,
  Shield, Activity
} from "lucide-react";

const kpis = [
  { title: "Gross Revenue", value: "€1,245,800", change: "+24%", trend: "up", icon: TrendingUp, sub: "All time" },
  { title: "Total Orders", value: "4,820", change: "+18%", trend: "up", icon: ShoppingBag, sub: "Since launch" },
  { title: "Avg. Order Value", value: "€258", change: "+3.1%", trend: "up", icon: Activity, sub: "Per transaction" },
  { title: "Return Rate", value: "1.8%", change: "-0.3%", trend: "up", icon: Users, sub: "Lower is better" },
  { title: "Active Staff", value: "12", change: "+2", trend: "up", icon: Users, sub: "3 locations" },
  { title: "System Alerts", value: "0", change: "0", trend: "up", icon: AlertTriangle, sub: "All clear" },
];

const topProducts = [
  { rank: 1, name: "Moto Jacket", units: 48, revenue: "€32,640", margin: "68%" },
  { rank: 2, name: "Essential Hoodie", units: 90, revenue: "€22,050", margin: "72%" },
  { rank: 3, name: "Tech Shell Jacket", units: 35, revenue: "€18,200", margin: "61%" },
  { rank: 4, name: "Tech Cargo Pants", units: 61, revenue: "€19,520", margin: "58%" },
  { rank: 5, name: "Street Runner", units: 22, revenue: "€9,020", margin: "55%" },
];

const auditLog = [
  { action: "Admin 'Yuki' updated product pricing for Moto Jacket", time: "10 min ago", level: "medium" },
  { action: "Failed login attempt — IP 192.168.1.1", time: "1 hr ago", level: "high" },
  { action: "Order #8922 status changed to Shipped", time: "2 hrs ago", level: "info" },
  { action: "Database backup completed successfully", time: "3 hrs ago", level: "info" },
  { action: "New staff account created: staff@aurastreet.com", time: "5 hrs ago", level: "medium" },
  { action: "Super Admin session started", time: "Just now", level: "info" },
];

const weeklyRevenue = [
  { day: "Mon", val: 38 }, { day: "Tue", val: 62 }, { day: "Wed", val: 48 },
  { day: "Thu", val: 80 }, { day: "Fri", val: 54 }, { day: "Sat", val: 92 }, { day: "Sun", val: 70 },
];

const cardClass = "bg-neutral-900 border border-neutral-800 rounded-2xl";
const redCard = "bg-red-950/10 border border-red-900/30 rounded-2xl";

export default function SuperAdminDashboard() {
  return (
    <div className="pb-16 space-y-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-red-900/30">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-red-500/70 font-bold mb-1">Super Admin · Root Access</p>
          <h1 className="text-2xl font-display font-bold uppercase tracking-widest text-white">System Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] uppercase tracking-widest font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Root Access
          </span>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <motion.div
        initial="hidden" animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {kpis.map((k, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
            className={`${i === 5 ? redCard : cardClass} p-5 relative overflow-hidden group`}
          >
            <k.icon className="absolute -right-2 -bottom-2 w-14 h-14 text-white/[0.03]" />
            <div className="flex items-center justify-between mb-3">
              <div className="p-1.5 bg-black rounded-lg border border-neutral-800">
                <k.icon className={`w-3.5 h-3.5 ${i === 5 ? "text-red-500" : i === 3 ? "text-green-500" : "text-brand-sky"}`} />
              </div>
              <div className={`flex items-center gap-0.5 text-[9px] font-bold ${k.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                <ArrowUpRight className="w-2.5 h-2.5" />
                {k.change}
              </div>
            </div>
            <div className="text-xl font-display font-bold text-white">{k.value}</div>
            <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mt-1">{k.title}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className={`${cardClass} p-6 xl:col-span-2 flex flex-col`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-1">All Channels</p>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Revenue Trend</h3>
            </div>
            <select className="bg-black border border-neutral-800 text-neutral-400 text-[10px] uppercase tracking-widest rounded-lg px-3 py-2 outline-none focus:border-brand-sky transition-colors">
              <option>This Week</option><option>This Month</option><option>This Year</option>
            </select>
          </div>
          <div className="flex-1 min-h-[220px] flex items-end gap-3">
            {weeklyRevenue.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 text-white text-[9px] px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                  {b.day}: {b.val}%
                </div>
                <div className="w-full rounded-t-lg overflow-hidden flex items-end" style={{ height: 200 }}>
                  <div className="w-full bg-red-500/20 border-t-2 border-red-500 group-hover:bg-red-500/35 transition-all duration-300" style={{ height: `${b.val}%` }} />
                </div>
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">{b.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className={`${cardClass} p-6 flex flex-col`}
        >
          <div className="mb-5">
            <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-1">By Revenue</p>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Top Products</h3>
          </div>
          <div className="flex-1 space-y-4">
            {topProducts.map((p) => (
              <div key={p.rank} className="flex items-center gap-3">
                <span className="text-[9px] font-bold text-neutral-600 w-5 shrink-0">0{p.rank}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-[11px] font-bold text-white truncate">{p.name}</p>
                    <p className="text-[10px] font-bold text-brand-sky shrink-0 ml-2">{p.revenue}</p>
                  </div>
                  <div className="mt-1.5 h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500/60 rounded-full" style={{ width: p.margin }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── Security Audit Log ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className={`${redCard} overflow-hidden`}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-red-900/30">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-[9px] uppercase tracking-widest text-red-500/60 font-bold">System</p>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Security Audit Log</h3>
            </div>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Last 24 hrs</span>
        </div>
        <div className="divide-y divide-red-900/20">
          {auditLog.map((log, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-red-500/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${log.level === "high" ? "bg-red-500" : log.level === "medium" ? "bg-yellow-500" : "bg-brand-sky"}`} />
                <span className="text-xs text-white">{log.action}</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-neutral-500 shrink-0 ml-6">{log.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
