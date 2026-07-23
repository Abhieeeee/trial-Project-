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

        {/* Orders Tracking Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-3 font-mono">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Package className="w-4 h-4 text-[#00d2ff]" /> Active Customer Shipments
            </h3>
            <span className="text-[9px] uppercase tracking-widest text-neutral-500">Live Telemetry</span>
          </div>

          {customerOrders.map((order) => {
            // Calculate progress percentage: step 1 -> 0%, step 2 -> 33.3%, step 3 -> 66.6%, step 4 -> 100%
            const progressPercent = Math.min(100, Math.max(0, ((order.step - 1) / (steps.length - 1)) * 100));

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${cardClass} p-6 sm:p-8 rounded-2xl space-y-8 border border-neutral-850`}
              >
                {/* Order Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-850 pb-5 font-mono text-xs">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[#00d2ff] font-bold text-sm">{order.id}</span>
                      <Badge status={order.status} />
                    </div>
                    <p className="text-white font-bold text-sm uppercase font-sans">{order.item}</p>
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

                {/* Carrier & Destination Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
                  <span>Carrier: <strong className="text-white">{order.carrier}</strong></span>
                  <span>Destination: <strong className="text-white">{order.address}</strong></span>
                </div>

                {/* VISUAL SHIPMENT PROGRESS BAR STEPPER */}
                <div className="pt-2 pb-4 font-mono">
                  <div className="relative w-full px-2">
                    
                    {/* Background Track Bar */}
                    <div className="absolute top-4 left-6 right-6 h-2 bg-neutral-900 rounded-full border border-white/5 pointer-events-none" />

                    {/* Active Animated Gradient Fill Progress Bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute top-4 left-6 h-2 bg-gradient-to-r from-emerald-500 via-[#00d2ff] to-cyan-400 rounded-full shadow-[0_0_12px_rgba(0,210,255,0.4)] pointer-events-none"
                      style={{ maxWidth: "calc(100% - 3rem)" }}
                    />

                    {/* Milestone Step Nodes */}
                    <div className="relative z-10 flex items-center justify-between">
                      {steps.map((st, idx) => {
                        const stepNum = idx + 1;
                        const isPassed = order.step >= stepNum;
                        const isCurrent = order.step === stepNum;

                        return (
                          <div key={st.title} className="flex flex-col items-center text-center space-y-2 group">
                            {/* Node Circle */}
                            <div className="relative">
                              {isCurrent && (
                                <span className="absolute -inset-1 rounded-full bg-[#00d2ff]/30 animate-ping pointer-events-none" />
                              )}

                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border ${
                                  isCurrent
                                    ? "bg-[#00d2ff] text-black border-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.6)] scale-110"
                                    : isPassed
                                    ? "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                    : "bg-neutral-950 text-neutral-600 border-neutral-800"
                                }`}
                              >
                                {isPassed && !isCurrent ? (
                                  <Check className="w-4 h-4 text-black stroke-[3]" />
                                ) : (
                                  <span>{stepNum}</span>
                                )}
                              </div>
                            </div>

                            {/* Node Titles & Badges */}
                            <div className="max-w-[100px] sm:max-w-[120px] space-y-0.5">
                              <h4 className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                isCurrent ? "text-[#00d2ff]" : isPassed ? "text-white" : "text-neutral-500"
                              }`}>
                                {st.title}
                              </h4>
                              <p className="text-[8px] text-neutral-400 uppercase tracking-widest hidden sm:block">
                                {st.label}
                              </p>
                              <span className={`inline-block text-[7px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded border mt-1 ${
                                isCurrent
                                  ? "bg-[#00d2ff]/10 text-[#00d2ff] border-[#00d2ff]/30"
                                  : isPassed
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  : "bg-white/5 text-neutral-600 border-white/5"
                              }`}>
                                {isCurrent ? "IN PROGRESS" : isPassed ? "DONE" : "QUEUED"}
                              </span>
                            </div>
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
    </PageShell>
  );
}
