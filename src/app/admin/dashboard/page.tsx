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
} from "lucide-react";

import { Badge } from "@/components/admin/Badge";
import {
  getDashboardStats,
  getOrders,
  getWeeklyRevenue,
  getOrderPipeline,
} from "@/lib/db";

export const revalidate = 0; // Disable caching to fetch live records

export default async function AdminDashboardPage() {
  const [stats, recentOrders, weeklySales, pipeline] = await Promise.all([
    getDashboardStats(),
    getOrders(),
    getWeeklyRevenue(),
    getOrderPipeline(),
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
      value: `EUR ${salesToday.toLocaleString("en-US", { minimumFractionDigits: 0 })}`, 
      change: "Live figures", 
      icon: TrendingUp 
    },
    { 
      title: "Orders Today", 
      value: `${ordersToday}`, 
      change: "Inbound orders", 
      icon: ShoppingBag 
    },
    { 
      title: "To Fulfill", 
      value: `${toFulfill}`, 
      change: "Awaiting confirm", 
      icon: PackageCheck 
    },
    { 
      title: "Total Customers", 
      value: `${stats.total_customers}`, 
      change: "Registered users", 
      icon: Users 
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
    { label: "Orders Pending packing", count: toFulfill, tone: "text-amber-400", icon: AlertTriangle },
    { label: "Dispatched & transit items", count: recentOrders.filter(o => o.status === "Shipped").length, tone: "text-brand-sky", icon: Clock3 },
    { label: "Completed deliveries", count: recentOrders.filter(o => o.status === "Delivered").length, tone: "text-emerald-400", icon: CheckCircle2 },
  ];

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-brand-sky">Operations workspace</p>
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-white">Admin Dashboard</h1>
          <p className="mt-3 max-w-2xl text-xs uppercase tracking-[0.12em] text-neutral-400">
            Run daily sales, fulfillment, stock, and customer operations.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-400">
          <Clock3 className="h-3.5 w-3.5 text-brand-sky" />
          Live operations / {formattedDate}
        </div>
      </div>

      {/* Metrics Grid */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.title} className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-500">{metric.title}</p>
              <metric.icon className="h-4 w-4 text-brand-sky" />
            </div>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
            <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-400">{metric.change}</p>
          </div>
        ))}
      </section>

      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        
        {/* Sales Graph */}
        <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-5 md:p-6">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">7-day sales</h2>
              <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-neutral-500">
                EUR {totalWeeklyRevenue.toLocaleString("en-US")} gross revenue
              </p>
            </div>
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Live activity
            </span>
          </div>
          <div className="flex h-64 items-end gap-2 sm:gap-4">
            {chartSales.map((entry) => (
              <div key={entry.day} className="group flex h-full min-w-0 flex-1 flex-col justify-end gap-3">
                <div className="relative flex flex-1 items-end overflow-hidden rounded-t-sm border border-neutral-800 bg-black">
                  <div className="w-full border-t border-brand-sky/60 bg-brand-sky/25 transition-colors group-hover:bg-brand-sky/45" style={{ height: `${entry.percentage}%` }} />
                  <span className="absolute inset-x-0 top-2 hidden text-center text-[8px] font-bold text-white lg:block">
                    {entry.amount}
                  </span>
                </div>
                <span className="text-center text-[8px] font-bold uppercase tracking-[0.12em] text-neutral-500">{entry.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Operations Queue */}
        <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-5 md:p-6">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white">Operations queue</h2>
          <div className="space-y-3">
            {operationalQueue.map((item) => (
              <div key={item.label} className="flex items-center gap-4 rounded-md border border-neutral-800 bg-black px-4 py-4">
                <item.icon className={`h-4 w-4 ${item.tone}`} />
                <p className="min-w-0 flex-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-300">{item.label}</p>
                <span className={`text-lg font-bold ${item.tone}`}>{item.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link href="/admin/orders" className="rounded-md bg-white px-3 py-3 text-center text-[9px] font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-brand-sky">Process orders</Link>
            <Link href="/admin/inventory" className="rounded-md border border-neutral-700 px-3 py-3 text-center text-[9px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:border-brand-sky hover:text-brand-sky">Check stock</Link>
          </div>
        </section>
      </div>

      {/* Recent Orders Table */}
      <section className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
        <div className="flex flex-col gap-3 border-b border-neutral-800 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Recent orders</h2>
            <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-neutral-500">Review and continue fulfillment operations</p>
          </div>
          <Link href="/admin/orders" className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-sky hover:text-white">View all orders</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="border-b border-neutral-800 bg-black/50 text-[8px] font-bold uppercase tracking-[0.16em] text-neutral-500">
              <tr>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Operation</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-neutral-800 last:border-0">
                  <td className="px-5 py-4 text-[10px] font-bold tracking-[0.12em] text-white">{order.order_code}</td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-white">{order.customer_name}</p>
                    <p className="mt-1 text-[9px] text-neutral-500">{order.customer_email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge status={order.status as "Pending" | "Shipped" | "Delivered" | "Cancelled"} />
                  </td>
                  <td className="px-5 py-4 text-xs font-bold text-brand-sky">EUR {order.total}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.13em] text-neutral-300">
                      {order.status === "Pending" ? <AlertTriangle className="h-3.5 w-3.5 text-amber-300" /> : <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                      {order.status === "Pending" ? "Confirm & pack" : "View timeline"}
                    </span>
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
