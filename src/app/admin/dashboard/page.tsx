"use client";

import { motion } from "framer-motion";
import {
  TrendingUp, ShoppingBag, Users, Activity,
  ArrowUpRight, ArrowDownRight, Package,
  BarChart2, AlertCircle
} from "lucide-react";

const stats = [
  { title: "Monthly Revenue", value: "€124,500", change: "+12.5%", trend: "up", icon: TrendingUp, note: "vs last month" },
  { title: "Active Orders", value: "142", change: "+5.2%", trend: "up", icon: ShoppingBag, note: "pending fulfillment" },
  { title: "Customers", value: "8,234", change: "+18.1%", trend: "up", icon: Users, note: "lifetime registered" },
  { title: "Conversion Rate", value: "3.2%", change: "-0.4%", trend: "down", icon: Activity, note: "store visits → sale" },
];

const topProducts = [
  { rank: 1, name: "Moto Jacket", category: "Jackets", units: 48, revenue: "€32,640", trend: "up" },
  { rank: 2, name: "Tech Shell Jacket", category: "Jackets", units: 35, revenue: "€18,200", trend: "up" },
  { rank: 3, name: "Essential Hoodie", category: "Hoodies", units: 90, revenue: "€22,050", trend: "up" },
  { rank: 4, name: "Tech Cargo Pants", category: "Pants", units: 61, revenue: "€19,520", trend: "down" },
  { rank: 5, name: "Street Runner", category: "Sneakers", units: 22, revenue: "€9,020", trend: "up" },
];

const recentActivity = [
  { id: 1, action: "Order #8924 placed", user: "Alex Chen", time: "2 min ago", amount: "€680", type: "order" },
  { id: 2, action: "Order #8923 shipped", user: "System", time: "15 min ago", amount: "", type: "ship" },
  { id: 3, action: "New customer registered", user: "Sarah Miller", time: "1 hr ago", amount: "", type: "user" },
  { id: 4, action: "Order #8922 placed", user: "David Kim", time: "2 hrs ago", amount: "€245", type: "order" },
  { id: 5, action: "Low stock: Tech Cargo Pants (M)", user: "System", time: "3 hrs ago", amount: "", type: "alert" },
];

const orderPipeline = [
  { label: "Pending", count: 28, color: "bg-yellow-500", pct: 20 },
  { label: "Shipped", count: 74, color: "bg-brand-sky", pct: 52 },
  { label: "Delivered", count: 32, color: "bg-green-500", pct: 23 },
  { label: "Cancelled", count: 8, color: "bg-red-500", pct: 5 },
];

const barData = [
  { day: "Mon", height: 40, value: "€8,200" },
  { day: "Tue", height: 60, value: "€12,100" },
  { day: "Wed", height: 35, value: "€7,150" },
  { day: "Thu", height: 80, value: "€16,400" },
  { day: "Fri", height: 50, value: "€10,000" },
  { day: "Sat", height: 90, value: "€18,800" },
  { day: "Sun", height: 75, value: "€15,500" },
];

const cardClass = "bg-neutral-900 border border-neutral-800 rounded-2xl";

export default function AdminDashboard() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="pb-16 space-y-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-bold mb-1">Admin Portal</p>
          <h1 className="text-2xl font-display font-bold uppercase tracking-widest text-white">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2">
            {dateStr}
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] uppercase tracking-widest font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <motion.div
        initial="hidden" animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
      >
        {stats.map((s, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
            className={`${cardClass} p-5 relative overflow-hidden group`}
          >
            {/* faint bg icon */}
            <s.icon className="absolute -right-3 -bottom-3 w-20 h-20 text-white/[0.03] group-hover:text-white/[0.06] transition-colors" />

            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-black rounded-xl border border-neutral-800">
                <s.icon className="w-4 h-4 text-brand-sky" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${s.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {s.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {s.change}
              </div>
            </div>

            <div className="text-2xl font-display font-bold text-white mb-1">{s.value}</div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">{s.title}</div>
            <div className="text-[9px] text-neutral-600 mt-1">{s.note}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Revenue Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
          className={`${cardClass} p-6 xl:col-span-2 flex flex-col`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Revenue Overview</p>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Weekly Sales</h3>
            </div>
            <select className="bg-black border border-neutral-800 text-neutral-400 text-[10px] uppercase tracking-widest rounded-lg px-3 py-2 outline-none focus:border-brand-sky transition-colors">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>

          {/* Bars */}
          <div className="flex-1 min-h-[240px] flex items-end gap-3">
            {barData.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                  {bar.value}
                </div>
                <div className="w-full rounded-t-lg overflow-hidden flex items-end" style={{ height: 200 }}>
                  <div
                    className="w-full bg-brand-sky/20 border-t-2 border-brand-sky group-hover:bg-brand-sky/40 transition-all duration-300"
                    style={{ height: `${bar.height}%` }}
                  />
                </div>
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">{bar.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }}
          className={`${cardClass} p-6 flex flex-col`}
        >
          <div className="mb-6">
            <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Order Breakdown</p>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Pipeline</h3>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-5">
            {/* Total doughnut-style indicator */}
            <div className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-neutral-800">
              <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Total Orders</span>
              <span className="text-xl font-display font-bold text-white">142</span>
            </div>

            {orderPipeline.map((o, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                  <span className="text-neutral-400">{o.label}</span>
                  <span className="text-white">{o.count}</span>
                </div>
                <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className={`h-full ${o.color} rounded-full transition-all duration-700`} style={{ width: `${o.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Row: Top Products + Activity ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Top Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
          className={`${cardClass} xl:col-span-2 overflow-hidden`}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-800">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Sales Performance</p>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Top Products</h3>
            </div>
            <BarChart2 className="w-4 h-4 text-neutral-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold border-b border-neutral-800">
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 text-right">Units</th>
                  <th className="px-6 py-3 text-right">Revenue</th>
                  <th className="px-6 py-3 text-right">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.rank} className="border-b border-neutral-800/50 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-[10px] font-bold text-neutral-500">{String(p.rank).padStart(2, "0")}</td>
                    <td className="px-6 py-4 text-xs font-bold text-white">{p.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-[9px] uppercase tracking-widest rounded">{p.category}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-white text-right font-bold">{p.units}</td>
                    <td className="px-6 py-4 text-xs text-brand-sky text-right font-bold">{p.revenue}</td>
                    <td className="px-6 py-4 text-right">
                      {p.trend === "up"
                        ? <ArrowUpRight className="w-4 h-4 text-green-500 ml-auto" />
                        : <ArrowDownRight className="w-4 h-4 text-red-500 ml-auto" />
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
          className={`${cardClass} p-6 flex flex-col`}
        >
          <div className="mb-6">
            <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Live Feed</p>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Activity</h3>
          </div>

          <div className="flex-1 flex flex-col gap-5">
            {recentActivity.map((a, idx) => {
              const iconMap: Record<string, React.ReactNode> = {
                order: <ShoppingBag className="w-3.5 h-3.5 text-brand-sky" />,
                ship: <Package className="w-3.5 h-3.5 text-green-500" />,
                user: <Users className="w-3.5 h-3.5 text-yellow-500" />,
                alert: <AlertCircle className="w-3.5 h-3.5 text-red-500" />,
              };
              return (
                <div key={a.id} className="flex gap-3">
                  <div className="relative shrink-0">
                    <div className="w-7 h-7 rounded-full bg-black border border-neutral-800 flex items-center justify-center">
                      {iconMap[a.type]}
                    </div>
                    {idx < recentActivity.length - 1 && (
                      <div className="absolute top-7 left-1/2 -translate-x-1/2 w-px h-8 bg-neutral-800" />
                    )}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[11px] font-semibold text-white leading-tight">{a.action}</p>
                      {a.amount && <span className="text-[10px] font-bold text-brand-sky shrink-0">{a.amount}</span>}
                    </div>
                    <div className="flex justify-between text-[9px] uppercase tracking-widest text-neutral-500 mt-1">
                      <span>{a.user}</span>
                      <span>{a.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="mt-6 w-full py-3 border border-neutral-800 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 hover:bg-white/5 hover:text-white transition-colors">
            View All Activity
          </button>
        </motion.div>

      </div>

      {/* ── DB Integration Note ── */}
      <div className="p-4 bg-brand-sky/5 border border-brand-sky/20 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-brand-sky shrink-0 mt-0.5" />
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
          All data is currently mocked. Connect Supabase to enable live analytics.
          <span className="text-brand-sky ml-2 cursor-pointer hover:underline">View Integration Plan →</span>
        </p>
      </div>

    </div>
  );
}
