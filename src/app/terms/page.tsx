"use client";

import { motion } from "framer-motion";
import { FileText, Scale, Globe, AlertTriangle } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

export default function TermsPage() {
  const sections = [
    {
      icon: Globe,
      title: "1. Scope & Execution",
      text: "These terms govern the use of aurastreet.com and purchase actions across AURA.STREET. By accessing the site and buying garments, you agree to these legal conditions.",
    },
    {
      icon: FileText,
      title: "2. Garment Details & Pricing",
      text: "All catalog prices are listed in EUR (with localization filters supported). We reserve the right to correct pricing errors, modify capsule limits, or limit sales of numbered pieces.",
    },
    {
      icon: Scale,
      title: "3. Purchase Acceptance & Purges",
      text: "Order confirmations represent receipt of requests. We reserve the right to cancel orders due to stock discrepancy or fraud flags, with immediate reimbursement to your card.",
    },
    {
      icon: AlertTriangle,
      title: "4. Intellectual Property & Code",
      text: "All text, 3D configurations, WebGL shaders, visual layout codes, clothing patterns, and logos are properties of AURA.STREET. Reproduction is strictly prohibited.",
    },
    {
      icon: FileText,
      title: "5. Jurisdiction & Disputes",
      text: "This agreement is governed by the laws of France. Any disputes or actions relating to transactions will be resolved exclusively in the courts of Paris, France.",
    },
  ];

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto py-12">
        <PageIntro
          eyebrow="Legal"
          title="Terms of Service"
          text="These rules constitute a binding agreement for using aurastreet.com."
        />

        <section className="px-6 md:px-12 max-w-4xl mx-auto pb-28 space-y-6">
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="space-y-6"
          >
            {sections.map((section) => (
              <motion.div 
                key={section.title}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
                }}
                className="glass-panel-glow rounded-xl p-6 flex items-start gap-4"
              >
                <section.icon className="w-5 h-5 text-brand-sky shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-2">{section.title}</h3>
                  <p className="text-[11px] text-neutral-450 leading-relaxed uppercase tracking-wider">{section.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <p className="text-[9px] text-neutral-600 uppercase tracking-widest text-center mt-12">
            Last Updated: July 2026 // AURA.STREET Compliance Group
          </p>
        </section>
      </div>
    </PageShell>
  );
}
