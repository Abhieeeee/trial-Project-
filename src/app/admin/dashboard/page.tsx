import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  PackageCheck,
  ShoppingBag,
  TrendingUp,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { Badge } from "@/components/admin/Badge";
import {
  getDashboardStats,
  getOrders,
  getWeeklyRevenue,
} from "@/lib/db";

export const revalidate = 0; // Disable caching to fetch live records

export default async function AdminDashboardPage() {
  const [stats, recentOrders, weeklySales] = await Promise.all([
    getDashboardStats(),
    getOrders(),
    getWeeklyRevenue(),
  ]);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Compute daily metrics from database orders list
  const salesToday = recentOrders
    .filter((o) => new Date(o.created_at) >= todayStart && o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const ordersToday = recentOrders
    .filter((o) => new Date(o.created_at) >= todayStart)
    .length;

  const toFulfill = recentOrders.filter((o) => o.status === "Pending").length;

  const metrics = [
    { 
      title: "Sales Today", 
      value: `€${salesToday.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, 
      change: "+18.4% vs yesterday",
      changeTone: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      icon: TrendingUp,
      accent: "from-[#00D2FF]/20 to-transparent",
    },
    { 
      title: "Orders Today", 
      value: `${ordersToday}`, 
      change: "Live Inbound", 
      changeTone: "text-sky-400 bg-sky-500/10 border-sky-500/30",
      icon: ShoppingBag,
      accent: "from-purple-500/20 to-transparent",
    },
    { 
      title: "Pending Fulfillment", 
      value: `${toFulfill}`, 
      change: "Action Required", 
      changeTone: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      icon: PackageCheck,
      accent: "from-amber-500/20 to-transparent",
    },
    { 
      title: "Registered Collectors", 
      value: `${stats.total_customers}`, 
      change: "Active Accounts", 
      changeTone: "text-[#00D2FF] bg-[#00D2FF]/10 border-[#00D2FF]/30",
      icon: Users,
      accent: "from-[#00D2FF]/20 to-transparent",
    },
  ];

  // Normalized weekly chart data
  const maxSales = Math.max(...weeklySales.map((s) => s.value), 1);
  const chartSales = weeklySales.map((s) => ({
    day: s.day,
    amount: `€${(s.value / 1000).toFixed(1)}K`,
    percentage: (s.value / maxSales) * 100,
  }));

  const totalWeeklyRevenue = weeklySales.reduce((sum, s) => sum + s.value, 0);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const operationalQueue = [
    { label: "Orders Pending Packing", count: toFulfill, tone: "text-amber-400 bg-amber-500/10 border-amber-500/30", icon: AlertTriangle },
    { label: "Dispatched & In Transit", count: recentOrders.filter(o => o.status === "Shipped").length, tone: "text-[#00D2FF] bg-[#00D2FF]/10 border-[#00D2FF]/30", icon: Clock3 },
    { label: "Completed Deliveries", count: recentOrders.filter(o => o.status === "Delivered").length, tone: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", icon: CheckCircle2 },
  ];

  return (
    <div className="pb-16 font-mono space-y-10">
      
      {/* Dashboard Page Title Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] text-[8px] uppercase tracking-widest font-extrabold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#00D2FF]" /> LIVE TELEMETRY DASHBOARD
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.15em] text-white font-display">
            Admin Control Center
          </h1>
          <p className="mt-2 text-xs text-neutral-400 tracking-wide font-sans max-w-xl">
            Real-time storefront revenue metrics, fulfillment queues, stock intelligence, and customer analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest text-neutral-300 backdrop-blur-xl">
            <Clock3 className="h-3.5 w-3.5 text-[#00D2FF]" />
            <span>Operational Cycle // {formattedDate}</span>
          </div>
        </div>
      </div>

      {/* 4 Metric Telemetry Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div 
            key={metric.title} 
            className="glass-panel-glow rounded-2xl p-6 border border-white/10 hover:border-[#00D2FF]/40 transition-all duration-300 relative overflow-hidden group space-y-4"
          >
            {/* Ambient Corner Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${metric.accent} rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`} />

            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 group-hover:text-white transition-colors">
                {metric.title}
              </p>
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-[#00D2FF] group-hover:border-[#00D2FF]/30 transition-all">
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
              <span className="text-[8px] uppercase tracking-widest text-neutral-500">Live Sync</span>
            </div>
          </div>
        ))}
      </section>

      {/* Graph & Operations Queue Grid */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.6fr_1fr]">
        
        {/* 7-Day Sales Telemetry Bar Graph */}
        <section className="glass-panel-glow rounded-2xl border border-white/10 p-6 md:p-8 space-y-6 relative">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white font-display">
                7-Day Gross Telemetry
              </h2>
              <p className="mt-1 text-[9px] uppercase tracking-widest text-neutral-400">
                €{totalWeeklyRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })} Total Storefront Output
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Active Sales Stream
            </span>
          </div>

          <div className="flex h-64 items-end gap-3 sm:gap-5 pt-4">
            {chartSales.map((entry) => (
              <div key={entry.day} className="group flex h-full min-w-0 flex-1 flex-col justify-end gap-3">
                <div className="relative flex flex-1 items-end overflow-hidden rounded-t-lg border border-white/10 bg-black/60">
                  <div 
                    className="w-full bg-gradient-to-t from-[#00D2FF]/20 via-[#00D2FF]/60 to-[#00D2FF] transition-all group-hover:brightness-125 rounded-t-sm" 
                    style={{ height: `${entry.percentage}%` }} 
                  />
                  <span className="absolute inset-x-0 top-2 hidden text-center text-[8px] font-extrabold text-white lg:block tracking-widest">
                    {entry.amount}
                  </span>
                </div>
                <span className="text-center text-[9px] font-bold uppercase tracking-widest text-neutral-400 group-hover:text-[#00D2FF] transition-colors">
                  {entry.day}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Operations Queue Widget */}
        <section className="glass-panel-glow rounded-2xl border border-white/10 p-6 md:p-8 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
              <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white font-display">
                Operations Queue
              </h2>
              <span className="text-[8px] uppercase tracking-widest text-neutral-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                Fulfillment Matrix
              </span>
            </div>

            <div className="space-y-4">
              {operationalQueue.map((item) => (
                <div key={item.label} className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/50 p-4 hover:border-white/20 transition-all">
                  <div className={`p-2.5 rounded-lg border ${item.tone}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <p className="min-w-0 flex-1 text-[10px] font-bold uppercase tracking-wider text-neutral-300">
                    {item.label}
                  </p>
                  <span className="text-xl font-extrabold font-display text-white">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 grid grid-cols-2 gap-4 border-t border-white/10">
            <Link 
              href="/admin/orders" 
              className="py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black text-[9px] uppercase tracking-[0.2em] font-extrabold text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Process Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link 
              href="/admin/inventory" 
              className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00D2FF] text-white text-[9px] uppercase tracking-[0.2em] font-extrabold text-center transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Stock Matrix</span>
            </Link>
          </div>
        </section>
      </div>

      {/* Recent Orders Glassmorphic Data Table */}
      <section className="glass-panel-glow rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between bg-black/40">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white font-display">
              Recent Storefront Orders
            </h2>
            <p className="mt-1 text-[9px] uppercase tracking-widest text-neutral-400">
              Live customer transaction log
            </p>
          </div>
          <Link 
            href="/admin/orders" 
            className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#00D2FF] hover:underline flex items-center gap-1.5"
          >
            <span>View Full Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead className="border-b border-white/10 bg-black/80 text-[8px] font-bold uppercase tracking-[0.25em] text-neutral-400">
              <tr>
                <th className="px-6 py-4">Order Code</th>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Fulfillment Status</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[10px]">
              {recentOrders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold tracking-wider text-white">
                    {order.order_code}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] flex items-center justify-center font-bold text-[9px]">
                        {order.customer_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white text-xs">{order.customer_name}</p>
                        <p className="text-[8px] text-neutral-500 tracking-wider">{order.customer_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={order.status as "Pending" | "Shipped" | "Delivered" | "Cancelled"} />
                  </td>
                  <td className="px-6 py-4 font-extrabold text-[#00D2FF] text-xs">
                    €{Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href="/admin/orders"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-[#00D2FF] hover:bg-[#00D2FF]/10 text-white text-[8px] uppercase tracking-widest font-bold transition-all"
                    >
                      {order.status === "Pending" ? <AlertTriangle className="h-3 w-3 text-amber-400" /> : <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                      <span>{order.status === "Pending" ? "Confirm & Pack" : "Manage Order"}</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
