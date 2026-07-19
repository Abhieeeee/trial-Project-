"use client";

import Image from "next/image";
import { Beaker, Leaf, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

export default function AboutPage() {
  return (
    <PageShell>
      <div className="max-w-7xl mx-auto py-12">
        <PageIntro
          eyebrow="About"
          title="Luxury streetwear engineered for the modern city"
          text="AURA.STREET builds quiet, technical silhouettes around heavyweight fabric, architectural patterning, and a precise sky-blue accent language."
        />
        <section className="px-6 md:px-12 max-w-7xl mx-auto pb-28 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden glass-panel-glow"
          >
            <Image src="/editorial-spread.png" alt="AURA STREET studio editorial" fill className="object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-sky text-glow-sky font-bold mb-6 font-display">
              Brand System
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-[0.1em] mb-8 text-white">
              Restraint is the loudest detail.
            </h2>
            <p className="text-sm text-neutral-455 leading-relaxed tracking-wide mb-10">
              Every garment is built as a long-term object: heavy cotton, weather-ready shells, brushed hardware, clean labels,
              and fit blocks that feel oversized without losing structure.
            </p>
            
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.08 } }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {[
                { icon: Beaker, title: "Material Research", text: "Cotton, leather, nylon, and technical shells selected for drape and durability." },
                { icon: Shield, title: "Performance", text: "Urban weather protection, reinforced seams, and production-grade hardware." },
                { icon: Leaf, title: "Small Batches", text: "Controlled inventory planning and limited releases to reduce overproduction." },
                { icon: Sparkles, title: "Sky Signature", text: "The brand accent appears through labels, glow states, and product finishes." },
              ].map((item) => (
                <motion.div 
                  key={item.title} 
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                  }}
                  className="glass-panel-glow rounded-xl p-5 hover:border-brand-sky/25 transition-colors"
                >
                  <item.icon className="w-5 h-5 text-brand-sky mb-4" />
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-2 text-white">{item.title}</h3>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>
      </div>
    </PageShell>
  );
}
