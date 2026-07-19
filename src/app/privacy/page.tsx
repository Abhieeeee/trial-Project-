"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Database, Lock, UserCheck } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

export default function PrivacyPage() {
  const sections = [
    {
      icon: Shield,
      title: "Data Collection Principles",
      text: "We collect order data (name, email, shipping address) and telemetry details to fulfill purchase contracts. Payment processing is completely offloaded to Stripe's encrypted sandbox environments.",
    },
    {
      icon: Eye,
      title: "How We Utilize Telemetry",
      text: "Telemetry metrics (page views, interactive hoodie morph cycles) are strictly used to optimize layout performance, reduce rendering lag, and coordinate stock drops. We do not track cross-site details.",
    },
    {
      icon: Database,
      title: "Third-Party Data Flow",
      text: "Data sharing is limited to logistics partners (shipping carriers) and Stripe. We do not sell user profiles to marketing brokers. All database transfers use SSL/TLS encryption protocols.",
    },
    {
      icon: Lock,
      title: "GDPR & Retainment Rights",
      text: "You retain full access, rectification, portability, and deletion control over your account. You can request record purging by contacting privacy@aurastreet.com. Order invoices are retained for legal audit periods.",
    },
    {
      icon: UserCheck,
      title: "Cookie Consents",
      text: "We use essential functional cookies to keep your cart sync alive and protect admin sessions. Optional analytics cookies are only enabled after explicit click approval on our greeting banners.",
    },
  ];

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto py-12">
        <PageIntro
          eyebrow="Legal"
          title="Privacy Policy"
          text="This document discloses our data security principles, collection bounds, and compliance metrics."
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
