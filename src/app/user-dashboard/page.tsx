"use client";

import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/admin/Badge";

type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

const todaySales = [
  { id: "ORD-8924", customer: "Alex Chen", item: "Moto Jacket", amount: "€680", status: "Pending" as OrderStatus, time: "2 min ago" },
  { id: "ORD-8923", customer: "Sarah Miller", item: "Essential Hoodie", amount: "€245", status: "Shipped" as OrderStatus, time: "15 min ago" },
  { id: "ORD-8922", customer: "David Kim", item: "Tech Shell Jacket", amount: "€520", status: "Delivered" as OrderStatus, time: "2 hrs ago" },
  { id: "ORD-8920", customer: "James Lee", item: "Shadow Hoodie II", amount: "€265", status: "Delivered" as OrderStatus, time: "5 hrs ago" },
];

const tasks = [
  { label: "Process pending orders (28 total)", done: false, priority: "high" },
  { label: "Prepare shipping labels for Jun 25 batch", done: false, priority: "high" },
  { label: "Check inventory: Shadow Hoodie II (Low)", done: false, priority: "medium" },
  { label: "Reply to customer inquiry #3421", done: true, priority: "low" },
  { label: "Update order #8919 tracking info", done: true, priority: "medium" },
];

const cardClass = "bg-neutral-900 border border-neutral-800 rounded-2xl";

export default function UserDashboard() {
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good Morning" : now.getHours() < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="pb-16 space-y-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-bold mb-1">Staff Portal</p>
          <h1 className="text-2xl font-display font-bold uppercase tracking-widest text-white">{greeting}</h1>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-400 text-[9px] uppercase tracking-widest font-bold self-start sm:self-auto">
          Read-Only Mode
        </span>
      </div>

      {/* ── Summary Cards ── */}
      <motion.div
        initial="hidden" animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-5"
      >
        {[
          { label: "Today's Orders", value: "14", icon: ShoppingBag, color: "text-brand-sky" },
          { label: "Pending Dispatch", value: "28", icon: Clock, color: "text-yellow-500" },
          { label: "Delivered Today", value: "9", icon: CheckCircle2, color: "text-green-500" },
        ].map((s, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
            className={`${cardClass} p-5 flex items-center gap-4`}
          >
            <div className={`p-3 bg-black rounded-xl border border-neutral-800 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-white">{s.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Main Content ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Today's Order Feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className={`${cardClass} xl:col-span-2 overflow-hidden`}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-800">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Live Feed</p>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Recent Sales</h3>
            </div>
            <TrendingUp className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="divide-y divide-neutral-800">
            {todaySales.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-neutral-500 tracking-widest mb-0.5">{s.id}</p>
                  <p className="text-xs font-bold text-white truncate">{s.customer}</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{s.item}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <Badge status={s.status} />
                  <span className="text-xs font-bold text-brand-sky w-14 text-right">{s.amount}</span>
                  <span className="text-[9px] text-neutral-600 uppercase tracking-widest w-16 text-right hidden sm:block">{s.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className={`${cardClass} p-6 flex flex-col`}
        >
          <div className="mb-5">
            <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Today</p>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Task List</h3>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            {tasks.map((t, i) => (
              <label key={i} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer group transition-colors ${t.done ? "border-neutral-800/50 opacity-50" : "border-neutral-800 hover:border-neutral-700 hover:bg-white/[0.02]"}`}>
                <input type="checkbox" defaultChecked={t.done} className="mt-0.5 w-3.5 h-3.5 accent-brand-sky shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className={`text-[11px] font-semibold leading-tight ${t.done ? "line-through text-neutral-600" : "text-white"}`}>{t.label}</p>
                  <span className={`text-[9px] uppercase tracking-widest font-bold mt-1 block ${t.priority === "high" ? "text-red-500" : t.priority === "medium" ? "text-yellow-500" : "text-neutral-600"}`}>
                    {t.priority} priority
                  </span>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-neutral-800 flex justify-between text-[9px] uppercase tracking-widest font-bold">
            <span className="text-neutral-500">{tasks.filter(t => t.done).length} / {tasks.length} Done</span>
            <span className="text-brand-sky">{Math.round(tasks.filter(t => t.done).length / tasks.length * 100)}%</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
