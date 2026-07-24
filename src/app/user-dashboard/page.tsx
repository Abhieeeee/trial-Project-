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
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      
      {/* Top Telemetry Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#00D2FF] mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse" />
            <span>Fulfillment Telemetry</span>
          </div>
          <h1 className="text-xl font-bold font-display text-white tracking-wide">
            Shipment & Order Tracking
          </h1>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
          <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-white font-semibold">
            3 Orders Total
          </span>
        </div>
      </div>

      {/* High-Density KPI Summary Metrics */}
      <motion.div
        initial="hidden" animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono"
      >
        {[
          { label: "Active Deliveries", value: "2 Parcels", icon: Truck, color: "text-[#00D2FF]", accent: "bg-[#00D2FF]" },
          { label: "Completed Orders", value: "12 Fulfilled", icon: CheckCircle2, color: "text-emerald-400", accent: "bg-emerald-400" },
          { label: "Primary Hub", value: "Kathmandu / Paris", icon: MapPin, color: "text-amber-400", accent: "bg-amber-400" },
        ].map((s, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } }}
            className="p-3.5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02]"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-black rounded-lg border border-white/10 ${s.color}`}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{s.value}</div>
                <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-medium">{s.label}</div>
              </div>
            </div>
            <span className={`w-1.5 h-1.5 rounded-full ${s.accent}`} />
          </motion.div>
        ))}
      </motion.div>

      {/* Orders Tracking Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pt-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-[#00D2FF]" /> Active Parcels
          </h3>
          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Live Updates</span>
        </div>

        {customerOrders.map((order) => {
          const progressPercent = Math.min(100, Math.max(0, ((order.step - 1) / (steps.length - 1)) * 100));

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all space-y-4 font-mono"
            >
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-[#00D2FF] font-bold text-xs">{order.id}</span>
                  <Badge status={order.status} />
                  <span className="text-white font-semibold text-xs font-sans">{order.item}</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-white">{order.amount}</span>
                  <button
                    onClick={() => copyTracking(order.trackingCode)}
                    className="px-2.5 py-0.5 bg-black border border-white/10 hover:border-white/30 text-[9px] text-[#00D2FF] rounded flex items-center gap-1 cursor-pointer transition-colors"
                    title="Copy tracking code"
                  >
                    {copiedId === order.trackingCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{order.trackingCode}</span>
                  </button>
                </div>
              </div>

              {/* Order Metadata Info Pill */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[9px] text-neutral-400 uppercase tracking-wider">
                <div>Recipient: <strong className="text-white">{order.customer}</strong></div>
                <div>Carrier: <strong className="text-white">{order.carrier}</strong></div>
                <div>Destination: <strong className="text-white">{order.address}</strong></div>
              </div>

              {/* Minimal Linear Progress Stepper */}
              <div className="pt-2 pb-1">
                <div className="relative w-full">
                  {/* Stepper Track */}
                  <div className="absolute top-3 left-4 right-4 h-1 bg-neutral-900 rounded-full border border-white/5 pointer-events-none" />
                  
                  {/* Stepper Active Bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute top-3 left-4 h-1 bg-[#00D2FF] rounded-full pointer-events-none"
                    style={{ maxWidth: "calc(100% - 2rem)" }}
                  />

                  {/* Nodes */}
                  <div className="relative z-10 flex items-center justify-between">
                    {steps.map((st, idx) => {
                      const stepNum = idx + 1;
                      const isPassed = order.step >= stepNum;
                      const isCurrent = order.step === stepNum;

                      return (
                        <div key={st.title} className="flex flex-col items-center text-center space-y-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all ${
                              isCurrent
                                ? "bg-[#00D2FF] text-black border-[#00D2FF] shadow-[0_0_8px_rgba(0,210,255,0.5)] scale-110"
                                : isPassed
                                ? "bg-emerald-500 text-black border-emerald-400"
                                : "bg-neutral-950 text-neutral-600 border-neutral-800"
                            }`}
                          >
                            {isPassed && !isCurrent ? <Check className="w-3 h-3 stroke-[3]" /> : stepNum}
                          </div>
                          
                          <span className={`text-[8px] uppercase tracking-wider font-semibold ${
                            isCurrent ? "text-[#00D2FF]" : isPassed ? "text-neutral-300" : "text-neutral-600"
                          }`}>
                            {st.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
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
