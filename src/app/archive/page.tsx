"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const seasons = [
  {
    code: "FW25",
    name: "VOID COLLECTION",
    pieces: 24,
    desc: "Our debut collection explored the concept of emptiness as a design principle. Monochrome palette, deconstructed seams, raw-edge finishing. Every piece sold out within 72 hours.",
    status: "SOLD OUT",
    statusColor: "text-red-500 border-red-500/30 bg-red-500/10",
    image: "/hero-editorial.png"
  },
  {
    code: "SS25",
    name: "LIGHT FRACTURE",
    pieces: 18,
    desc: "Inspired by the way light breaks through industrial glass, this collection introduced our signature reflective piping and translucent layering. Featured in Vogue Italia and Hypebeast.",
    status: "ARCHIVE",
    statusColor: "text-neutral-400 border-neutral-700 bg-neutral-900/50",
    image: "/editorial-spread.png"
  },
  {
    code: "FW24",
    name: "CONCRETE GARDEN",
    pieces: 20,
    desc: "The intersection of nature and urbanism. Heavy canvas outerwear with botanical embossing, organic cotton interiors, stone-washed finishes. Collaboration with Japanese textile artist Kenji Mori.",
    status: "LIMITED",
    statusColor: "text-brand-sky border-brand-sky/30 bg-brand-sky/10",
    image: "/collections-banner.png"
  },
  {
    code: "SS24",
    name: "FIRST LIGHT",
    pieces: 12,
    desc: "Where it all began. The capsule collection that launched AURA STREET. Minimalist essentials — three hoodies, three tees, three pants, three accessories. Each hand-numbered.",
    status: "GENESIS",
    statusColor: "text-white border-white/30 bg-white/10",
    image: "/moto-jacket.png"
  }
];

const timeline = [
  { date: "2024 Q1", event: "Brand founded in Paris by Émile Leclerc" },
  { date: "2024 Q2", event: "First Light capsule launches, sells out in 48 hours" },
  { date: "2024 Q3", event: "Featured in Highsnobiety's '10 Brands to Watch'" },
  { date: "2024 Q4", event: "Concrete Garden collaboration with Kenji Mori" },
  { date: "2025 Q1", event: "Light Fracture debuts at Paris Fashion Week" },
  { date: "2025 Q2", event: "Opens first atelier in Le Marais, Paris" },
  { date: "2025 Q3", event: "Void Collection breaks sales records" },
  { date: "2026 Q1", event: "Drop 01 launches with 3D interactive configurator" },
];

export default function Archive() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <main className="relative min-h-screen bg-black text-white w-full overflow-hidden pt-32">
      <CustomCursor />
      <Header />

      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Archive</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-extrabold uppercase tracking-[0.1em] font-display text-white mb-6">
            THE ARCHIVE
          </h1>
          <p className="text-sm md:text-base text-neutral-400 max-w-2xl mx-auto tracking-wide">
            A retrospective of past collections and limited editions.
          </p>
        </motion.div>
      </section>

      {/* Seasons Timeline */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-32 relative">
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-neutral-900 -translate-x-1/2 z-0 hidden md:block" />
        
        <div className="space-y-16 md:space-y-32 relative z-10">
          {seasons.map((season, idx) => (
            <motion.div
              key={idx}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.2 } }
              }}
              className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <motion.div variants={fadeUp} className="w-full md:w-1/2 relative aspect-[4/3] rounded-xl overflow-hidden glass-panel-glow group">
                <Image
                  src={season.image}
                  alt={season.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </motion.div>

              <motion.div variants={fadeUp} className={`w-full md:w-1/2 flex flex-col ${idx % 2 !== 0 ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}>
                <h2 className="text-5xl md:text-7xl font-display font-bold text-neutral-800 mb-2">{season.code}</h2>
                <div className={`inline-block px-3 py-1 rounded text-[9px] uppercase tracking-[0.2em] font-bold border mb-4 ${season.statusColor}`}>
                  {season.status}
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-widest mb-4">{season.name}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">{season.desc}</p>
                <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">
                  {season.pieces} Pieces
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brand Timeline */}
      <section className="py-24 px-6 md:px-12 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-display font-bold uppercase tracking-[0.1em]">BRAND TIMELINE</h2>
          </motion.div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-800 before:to-transparent">
            {timeline.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-800 bg-black group-[.is-active]:border-brand-sky text-neutral-500 group-[.is-active]:text-brand-sky shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-brand-sky" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-neutral-900 bg-neutral-950 shadow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-sky">{item.date}</span>
                  </div>
                  <div className="text-xs text-neutral-400">{item.event}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press & Recognition */}
      <section className="py-24 px-6 md:px-12 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-500 mb-8">Press & Recognition</h3>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-lg md:text-2xl font-display font-bold text-neutral-600 uppercase">
              <span className="hover:text-white transition-colors cursor-default">Vogue Italia</span>
              <span className="text-brand-sky">•</span>
              <span className="hover:text-white transition-colors cursor-default">Hypebeast</span>
              <span className="text-brand-sky">•</span>
              <span className="hover:text-white transition-colors cursor-default">Highsnobiety</span>
              <span className="text-brand-sky">•</span>
              <span className="hover:text-white transition-colors cursor-default">GQ France</span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
