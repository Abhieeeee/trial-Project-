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

const statusConfig: Record<OrderStatus, { color: string; dot: string; label: string; icon: React.ElementType }> = {
  Pending:   { color: "text-amber-400",  dot: "bg-amber-400",  label: "Pending",   icon: Clock },
  Shipped:   { color: "text-[#00D2FF]",  dot: "bg-[#00D2FF]", label: "In Transit", icon: Truck },
  Delivered: { color: "text-emerald-400", dot: "bg-emerald-400", label: "Delivered", icon: CheckCircle2 },
  Cancelled: { color: "text-red-400",    dot: "bg-red-400",   label: "Cancelled",  icon: Clock },
};

export default function UserDashboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 font-sans">

      {/* Minimal Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-base font-bold text-white font-display tracking-wide">My Orders</h1>
          <p className="text-[11px] text-neutral-400 mt-0.5">Track your active & past shipments</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse" />
          {orders.filter(o => o.status !== "Delivered").length} active
        </div>
      </div>

      {/* Order Cards */}
      <div className="space-y-3">
        {orders.map((order, i) => {
          const cfg = statusConfig[order.status];
          const StatusIcon = cfg.icon;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors overflow-hidden"
            >
              {/* Top Row */}
              <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[11px] font-semibold text-white font-sans truncate">{order.item}</p>
                  <p className="text-[10px] text-neutral-400 font-mono">{order.id} · {order.customer}</p>
                </div>
                <div className="shrink-0 text-right space-y-0.5">
                  <p className="text-sm font-bold text-white font-mono">{order.amount}</p>
                  <div className={`inline-flex items-center gap-1 text-[9px] font-mono font-semibold ${cfg.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </div>
                </div>
              </div>

              {/* Delivery Progress — 4 Dot Track */}
              <div className="px-4 pb-3">
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
                        {idx < STATUS_STEPS.length - 1 && (
                          <div
                            className={`w-1.5 h-1.5 rounded-full mx-0.5 transition-all ${
                              done ? "bg-emerald-400" : active ? "bg-[#00D2FF] shadow-[0_0_6px_rgba(0,210,255,0.8)]" : "bg-neutral-700"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[9px] text-neutral-400 font-mono">
                  <span>{STATUS_STEPS[order.step - 1]}</span>
                  <span className={order.status === "Delivered" ? "text-emerald-400 font-semibold" : "text-neutral-200 font-semibold"}>
                    {order.status === "Delivered" ? "✓ Delivered" : `ETA: ${order.eta}`}
                  </span>
                </div>
              </div>

              {/* Bottom Meta Bar */}
              <div className="px-4 py-2.5 border-t border-white/5 flex items-center justify-between gap-2 bg-white/[0.01]">
                <div className="text-[9px] text-neutral-400 font-mono truncate">
                  <span className="text-neutral-300 font-semibold">{order.carrier}</span>
                  <span className="mx-1.5 text-neutral-600">·</span>
                  <span>{order.address}</span>
                </div>
                <button
                  onClick={() => copyTracking(order.trackingCode)}
                  aria-label={`Copy tracking code ${order.trackingCode}`}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded bg-black border border-white/10 hover:border-white/25 active:scale-95 text-[9px] text-[#00D2FF] font-mono cursor-pointer transition-all min-h-[32px]"
                >
                  {copiedId === order.trackingCode
                    ? <><Check className="w-2.5 h-2.5 text-emerald-400" /> Copied</>
                    : <><Copy className="w-2.5 h-2.5" /> {order.trackingCode}</>
                  }
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
