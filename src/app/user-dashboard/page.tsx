"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, CheckCircle2, Clock, Truck, Package, Copy, Check, MapPin, ExternalLink, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/admin/Badge";
import PageShell from "@/components/PageShell";
import PageIntro from "@/components/PageIntro";
import PersonalTouchForm from "@/components/PersonalTouchForm";

type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

interface OrderTracking {
  id: string;
  customer: string;
  item: string;
  amount: string;
  status: OrderStatus;
  step: number; // 1 to 4
  trackingCode: string;
  carrier: string;
  address: string;
  date: string;
}

const customerOrders: OrderTracking[] = [
  {
    id: "AUR-NP8492",
    customer: "Aarav Sharma",
    item: "Moto Techwear Leather Jacket",
    amount: "NPR 98,600 (€680)",
    status: "Shipped",
    step: 3,
    trackingCode: "NP-KT-9048201",
    carrier: "Express Nepal Air Courier",
    address: "Kathmandu Valley, Lazimpat Ward 2",
    date: "July 22, 2026",
  },
  {
    id: "AUR-INT2049",
    customer: "Alex Chen",
    item: "Essential Geometry Hoodie",
    amount: "€245",
    status: "Pending",
    step: 2,
    trackingCode: "DHL-EX-4920194",
    carrier: "DHL Express Global",
    address: "Tokyo, Shibuya-ku 150-0042",
    date: "July 23, 2026",
  },
  {
    id: "AUR-NP1029",
    customer: "Siddharth Shrestha",
    item: "Shadow Cargo Pants II",
    amount: "NPR 37,700 (€260)",
    status: "Delivered",
    step: 4,
    trackingCode: "NP-KT-1029384",
    carrier: "Kathmandu City Express",
    address: "Patan, Lalitpur Ward 3",
    date: "July 18, 2026",
  },
];

const cardClass = "glass-panel-glow";

export default function UserDashboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const steps = [
    { title: "Order Verified", label: "Payment Confirmed" },
    { title: "Packed at Hub", label: "Quality Inspection" },
    { title: "In Transit", label: "Courier Dispatch" },
    { title: "Delivered", label: "Final Destination" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      
      {/* Sleek Minimal Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-lg font-bold font-display text-white tracking-wide">
            Live Orders & Fulfillment
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Real-time parcel dispatch & delivery telemetry
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
          <span className="text-neutral-300 font-semibold">{customerOrders.length} Active Shipments</span>
        </div>
      </div>

      {/* Orders Matrix */}
      <div className="space-y-3">
        {customerOrders.map((order) => {
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all space-y-3.5 font-mono"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-[#00D2FF] font-bold text-xs">{order.id}</span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-white font-semibold text-xs font-sans">{order.item}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white">{order.amount}</span>
                  <Badge status={order.status} />
                </div>
              </div>

              {/* 4-Segment Minimal Delivery Stepper */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[9px] text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold">Status:</span>
                    <span className="text-[#00D2FF] font-semibold">Step {order.step} of 4 — {steps[order.step - 1]?.title}</span>
                  </div>
                  <button
                    onClick={() => copyTracking(order.trackingCode)}
                    className="px-2 py-0.5 bg-black border border-white/10 hover:border-white/30 text-[9px] text-[#00D2FF] rounded flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedId === order.trackingCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{order.trackingCode}</span>
                  </button>
                </div>

                {/* 4 Thin Segmented Bars */}
                <div className="grid grid-cols-4 gap-1.5">
                  {steps.map((st, idx) => {
                    const stepNum = idx + 1;
                    const isPassed = order.step > stepNum;
                    const isCurrent = order.step === stepNum;

                    return (
                      <div key={st.title} className="space-y-1">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            isCurrent
                              ? "bg-[#00D2FF] shadow-[0_0_8px_rgba(0,210,255,0.6)]"
                              : isPassed
                              ? "bg-emerald-400"
                              : "bg-neutral-800"
                          }`}
                        />
                        <div className="text-[8px] uppercase tracking-wider text-center truncate text-neutral-500">
                          {st.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Metadata Sub-row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[9px] text-neutral-400 pt-1 border-t border-white/5">
                <div>Recipient: <strong className="text-neutral-200">{order.customer}</strong> • {order.address}</div>
                <div>Carrier: <strong className="text-neutral-200">{order.carrier}</strong> • {order.date}</div>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* Co-Creation & Personal Touch Form */}
      <PersonalTouchForm />

    </div>
  );
}
