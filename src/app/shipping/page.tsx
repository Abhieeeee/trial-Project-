"use client";

import { motion } from "framer-motion";
import { Truck, Globe, Shield, Zap } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

export default function ShippingPage() {
  const tiers = [
    { title: "Standard Delivery", price: "EUR 12", speed: "5-7 Business Days", note: "Complimentary on orders over EUR 300.", icon: Truck },
    { title: "Express Delivery", price: "EUR 18", speed: "2-3 Business Days", note: "Insured transit with signature verification.", icon: Zap },
    { title: "Next Day Priority", price: "EUR 28", speed: "1 Business Day", note: "Order before 2pm CET for same-day dispatch.", icon: Shield },
  ];

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto py-12">
        <PageIntro
          eyebrow="Shipping & Logistics"
          title="Global fulfillment networks"
          text="Every order ships from our Paris fulfillment center, fully tracked and packed under strict security controls."
        />

        <section className="px-6 md:px-12 max-w-6xl mx-auto pb-28 space-y-16">
          
          {/* Shipping Tiers */}
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {tiers.map((tier) => (
              <motion.div 
                key={tier.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
                }}
                className="glass-panel-glow rounded-xl p-6 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white">{tier.title}</h3>
                    <tier.icon className="w-4 h-4 text-brand-sky" />
                  </div>
                  <div className="text-xl font-display font-extrabold text-white mb-2">{tier.price}</div>
                  <div className="text-[10px] text-brand-sky uppercase tracking-widest font-bold mb-4">{tier.speed}</div>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500 leading-relaxed">{tier.note}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* International Rates Table */}
          <div className="glass-panel-glow rounded-xl overflow-hidden">
            <div className="border-b border-neutral-800 p-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white">International Delivery Estimates</h4>
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-black/60 text-[9px] uppercase tracking-[0.25em] text-neutral-500 border-b border-neutral-800">
                <tr>
                  <th className="p-5 font-bold">Region Zone</th>
                  <th className="p-5 font-bold">Transit Time</th>
                  <th className="p-5 font-bold">Base Cost</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["European Union", "3-5 Business Days", "EUR 15"],
                  ["United Kingdom", "5-7 Business Days", "EUR 18"],
                  ["United States & Canada", "7-10 Business Days", "EUR 25"],
                  ["Asia / Rest of World", "10-15 Business Days", "EUR 35"],
                ].map(([zone, time, cost]) => (
                  <tr key={zone} className="border-b border-neutral-900 last:border-0 hover:bg-white/[0.01] transition-colors">
                    <td className="p-5 text-white font-extrabold font-mono">{zone}</td>
                    <td className="p-5 text-neutral-350 font-mono">{time}</td>
                    <td className="p-5 text-brand-sky font-mono font-extrabold">{cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signature Packaging */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="glass-panel-glow rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-brand-sky" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Duty & Taxes</h3>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed uppercase tracking-wider">
                International shipments are shipped DDP (Delivered Duty Paid), meaning all import duties, custom charges, and taxes are calculated and collected directly at checkout. No additional handling fees are due upon delivery.
              </p>
            </div>

            <div className="glass-panel-glow rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-brand-sky" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Atelier Packaging</h3>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed uppercase tracking-wider">
                Every AURA.STREET garment is shipped in our custom matte-black structural boxes. Wrapped in pH-neutral anti-static protective tissue with a hand-pressed seal to protect technical coatings and details.
              </p>
            </div>
          </div>

        </section>
      </div>
    </PageShell>
  );
}
