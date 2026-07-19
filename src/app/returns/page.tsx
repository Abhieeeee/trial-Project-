"use client";

import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

export default function ReturnsPage() {
  const steps = [
    { title: "Initiate Return", desc: "Submit your request via the account panel within 30 days of delivery receipt.", icon: Package },
    { title: "Drop & Ship", desc: "Attach our prepaid, fully-insured label to your package and drop off at carrier.", icon: ArrowRight },
    { title: "Quality Check", desc: "Garments undergo structural and wear inspections at our Paris atelier (1-2 business days).", icon: RefreshCw },
    { title: "Refund Issued", desc: "Credit is returned to your original payment method within 3-5 business days.", icon: CheckCircle2 },
  ];

  const rules = [
    { title: "30-Day Window", desc: "Returns must be requested and shipped within 30 days of the marked delivery date." },
    { title: "Original State", desc: "Garments must be unworn, tags attached, with all original box packaging intact." },
    { title: "Excluded Drops", desc: "Archive capsules, special numbered pieces, and final sale items are ineligible for return." },
  ];

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto py-12">
        <PageIntro
          eyebrow="Returns & Exchanges"
          title="Frictionless returns"
          text="Our returns procedure is fully automated and insured to ensure a luxury experience."
        />

        <section className="px-6 md:px-12 max-w-6xl mx-auto pb-28 space-y-16">
          
          {/* Vertical timeline steps */}
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {steps.map((step, idx) => (
              <motion.div 
                key={step.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
                }}
                className="glass-panel-glow rounded-xl p-6 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-4xl font-display font-extrabold text-neutral-800">0{idx + 1}</span>
                    <step.icon className="w-5 h-5 text-brand-sky" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white mt-6 mb-2">{step.title}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Detailed Policy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rules.map((rule, idx) => (
              <div key={rule.title} className="glass-panel-glow rounded-xl p-6 border-l-2 border-brand-sky">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-2">{rule.title}</h4>
                <p className="text-[11px] text-neutral-450 leading-relaxed uppercase tracking-wider">{rule.desc}</p>
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="glass-panel rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/5 bg-black/40">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-brand-sky shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white">Need an exchange?</h4>
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Exchanges are processed free of charge for alternate sizing.</p>
              </div>
            </div>
            <a 
              href="/contact" 
              className="px-5 py-2.5 bg-white text-black hover:bg-brand-sky rounded text-[9px] uppercase tracking-widest font-extrabold transition-colors cursor-pointer"
            >
              Contact Support
            </a>
          </div>

        </section>
      </div>
    </PageShell>
  );
}
