"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Truck, CheckCircle2, Clock } from "lucide-react";
import PersonalTouchForm from "@/components/PersonalTouchForm";

type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

interface Order {
  id: string;
  customer: string;
  item: string;
  amount: string;
  status: OrderStatus;
  step: number;
  trackingCode: string;
  carrier: string;
  address: string;
  date: string;
  eta: string;
}

const orders: Order[] = [
  {
    id: "AUR-NP8492",
    customer: "Aarav Sharma",
    item: "Moto Techwear Leather Jacket",
    amount: "€680",
    status: "Shipped",
    step: 3,
    trackingCode: "NP-KT-9048201",
    carrier: "Express Nepal Air",
    address: "Kathmandu, LZP-2",
    date: "Jul 22",
    eta: "Jul 27, 2026",
  },
  {
    id: "AUR-INT2049",
    customer: "Alex Chen",
    item: "Essential Geometry Hoodie",
    amount: "€245",
    status: "Pending",
    step: 2,
    trackingCode: "DHL-EX-4920194",
    carrier: "DHL Express",
    address: "Tokyo, Shibuya 150",
    date: "Jul 23",
    eta: "Aug 1, 2026",
  },
  {
    id: "AUR-NP1029",
    customer: "Siddharth Shrestha",
    item: "Shadow Cargo Pants II",
    amount: "€260",
    status: "Delivered",
    step: 4,
    trackingCode: "NP-KT-1029384",
    carrier: "KTM City Express",
    address: "Patan, Lalitpur-3",
    date: "Jul 18",
    eta: "Delivered",
  },
];

const STATUS_STEPS = ["Confirmed", "Packed", "In Transit", "Delivered"];

const statusConfig: Record<OrderStatus, { color: string; dot: string; label: string; icon: React.ComponentType<{ className?: string }> }> = {
  Pending:   { color: "text-amber-400 border-amber-500/30 bg-amber-500/10",  dot: "bg-amber-400",  label: "Pending",   icon: Clock },
  Shipped:   { color: "text-[#00D2FF] border-[#00D2FF]/30 bg-[#00D2FF]/10",  dot: "bg-[#00D2FF]", label: "In Transit", icon: Truck },
  Delivered: { color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", dot: "bg-emerald-400", label: "Delivered", icon: CheckCircle2 },
  Cancelled: { color: "text-red-400 border-red-500/30 bg-red-500/10",    dot: "bg-red-400",   label: "Cancelled",  icon: Clock },
};

export default function UserDashboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">

      {/* Minimal Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-lg font-bold text-white font-display uppercase tracking-wider">Order History</h1>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">Track active & past shipments</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse" />
          <span>{orders.filter(o => o.status !== "Delivered").length} active shipments</span>
        </div>
      </div>

      {/* Order Cards */}
      <div className="space-y-4 font-mono">
        {orders.map((order, i) => {
          const cfg = statusConfig[order.status];
          const StatusIcon = cfg.icon;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-2xl border border-white/10 bg-[#0a0a0e]/80 hover:border-[#00D2FF]/30 transition-all overflow-hidden"
            >
              {/* Header Info */}
              <div className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#00D2FF] uppercase tracking-wider block font-mono">
                    {order.id} · {order.customer}
                  </span>
                  <p className="text-xs font-semibold text-white font-sans">{order.item}</p>
                </div>
                <div className="shrink-0 text-right space-y-1">
                  <p className="text-sm font-bold text-white font-mono">{order.amount}</p>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase border ${cfg.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{cfg.label}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-5 pb-4">
                <div className="flex items-center gap-1 mb-2">
                  {STATUS_STEPS.map((s, idx) => {
                    const done = order.step > idx + 1;
                    const active = order.step === idx + 1;
                    return (
                      <div key={s} className="flex items-center flex-1">
                        <div
                          className={`h-1 flex-1 rounded-full transition-all ${
                            done ? "bg-emerald-400" : active ? "bg-[#00D2FF]" : "bg-neutral-800"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[9px] text-neutral-400 font-mono">
                  <span>Step: {STATUS_STEPS[order.step - 1]}</span>
                  <span className={order.status === "Delivered" ? "text-emerald-400 font-semibold" : "text-neutral-300 font-semibold"}>
                    {order.status === "Delivered" ? "✓ Delivered" : `ETA: ${order.eta}`}
                  </span>
                </div>
              </div>

              {/* Meta Bar */}
              <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between gap-3 bg-white/[0.01]">
                <div className="text-[9px] text-neutral-400 font-mono truncate">
                  <span className="text-neutral-300 font-semibold">{order.carrier}</span>
                  <span className="mx-1.5 text-neutral-600">·</span>
                  <span>{order.address}</span>
                </div>
                <button
                  onClick={() => copyTracking(order.trackingCode)}
                  aria-label={`Copy tracking code ${order.trackingCode}`}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:border-[#00D2FF]/40 active:scale-95 text-[9px] text-[#00D2FF] font-mono cursor-pointer transition-all min-h-[32px]"
                >
                  {copiedId === order.trackingCode ? (
                    <><Check className="w-3 h-3 text-emerald-400" /> Copied</>
                  ) : (
                    <><Copy className="w-3 h-3" /> {order.trackingCode}</>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Personal Touch Form */}
      <PersonalTouchForm />

    </div>
  );
}
