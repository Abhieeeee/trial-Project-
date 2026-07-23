"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, CheckCircle2, Clock, Truck, Package, Copy, Check, MapPin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/admin/Badge";
import PageShell from "@/components/PageShell";
import PageIntro from "@/components/PageIntro";

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
    <PageShell>
      <div className="max-w-7xl mx-auto px-layout-padding py-12 space-y-8 font-sans">
        
        {/* Page Intro */}
        <PageIntro 
          eyebrow="Customer Dashboard" 
          title="Live Order Tracking & Fulfillment" 
          text="Track parcel dispatch, view 4-step fulfillment telemetry, and manage active order shipments." 
        />

        {/* Summary Cards */}
        <motion.div
          initial="hidden" animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 font-mono"
        >
          {[
            { label: "Active Deliveries", value: "2 Packages", icon: Truck, color: "text-[#00d2ff]" },
            { label: "Completed Orders", value: "12 Orders", icon: CheckCircle2, color: "text-emerald-400" },
            { label: "Dispatch Hub", value: "Kathmandu / Paris", icon: MapPin, color: "text-amber-400" },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
              className={`${cardClass} p-5 flex items-center gap-4 rounded-2xl`}
            >
              <div className={`p-3 bg-black rounded-xl border border-neutral-800 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-display font-bold text-white">{s.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Orders Tracking Cards with 4-Step Timeline */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-3 font-mono">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Package className="w-4 h-4 text-[#00d2ff]" /> Active Customer Shipments
            </h3>
            <span className="text-[9px] uppercase tracking-widest text-neutral-500">Live Telemetry</span>
          </div>

          {customerOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${cardClass} p-6 sm:p-8 rounded-2xl space-y-6 border border-neutral-850`}
            >
              {/* Order Info Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-850 pb-5 font-mono text-xs">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[#00d2ff] font-bold text-sm">{order.id}</span>
                    <Badge status={order.status} />
                  </div>
                  <p className="text-white font-bold text-sm uppercase font-display">{order.item}</p>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-1">
                    Recipient: {order.customer} // {order.date}
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <span className="text-sm font-bold text-white">{order.amount}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-neutral-400 uppercase font-mono">Tracking Code:</span>
                    <button
                      onClick={() => copyTracking(order.trackingCode)}
                      className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 hover:border-[#00d2ff] text-[9px] text-[#00d2ff] font-mono rounded flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === order.trackingCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {order.trackingCode}
                    </button>
                  </div>
                </div>
              </div>

              {/* 4-Step Fulfillment Progress Timeline */}
              <div className="space-y-4 font-mono">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-neutral-400 mb-2">
                  <span>Carrier: <strong className="text-white">{order.carrier}</strong></span>
                  <span>Destination: <strong className="text-white">{order.address}</strong></span>
                </div>

                <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
                  {steps.map((st, idx) => {
                    const stepNum = idx + 1;
                    const isPassed = order.step >= stepNum;
                    const isCurrent = order.step === stepNum;

                    return (
                      <div
                        key={st.title}
                        className={`p-4 border rounded-xl relative transition-all ${
                          isCurrent
                            ? "border-[#00d2ff] bg-[#00d2ff]/10 text-white shadow-[0_0_15px_rgba(0,210,255,0.15)]"
                            : isPassed
                            ? "border-emerald-500/40 bg-emerald-500/5 text-neutral-300"
                            : "border-neutral-900 bg-neutral-950/40 text-neutral-600"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCurrent
                              ? "bg-[#00d2ff] text-black"
                              : isPassed
                              ? "bg-emerald-400 text-black"
                              : "bg-neutral-800 text-neutral-500"
                          }`}>
                            {isPassed && !isCurrent ? "✓" : stepNum}
                          </span>
                          <span className={`text-[8px] uppercase tracking-widest font-bold ${
                            isCurrent ? "text-[#00d2ff] animate-pulse" : isPassed ? "text-emerald-400" : "text-neutral-600"
                          }`}>
                            {isCurrent ? "In Progress" : isPassed ? "Completed" : "Queued"}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display mb-0.5">
                          {st.title}
                        </h4>
                        <p className="text-[9px] text-neutral-400 uppercase tracking-widest">
                          {st.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </PageShell>
  );
}
