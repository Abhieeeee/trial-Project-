"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MoveRight, Shield, Leaf, Beaker } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

export default function Collections() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <main className="relative min-h-screen bg-black text-white w-full overflow-hidden">
      <CustomCursor />
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/collections-banner.png"
            alt="Collections Banner"
            fill
            className="object-cover object-center opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }}
          className="relative z-10 text-center px-6"
        >
          <span className="block text-[10px] uppercase tracking-[0.3em] text-brand-sky mb-4 text-glow-sky font-bold">
            Explore the Archives
          </span>
          <h1 className="text-5xl md:text-8xl font-extrabold uppercase tracking-[0.1em] font-display text-white drop-shadow-2xl">
            THE COLLECTIONS
          </h1>
        </motion.div>
      </section>

      {/* Current Season */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="flex items-center gap-4 mb-16">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">01</span>
            <div className="h-[1px] w-12 bg-neutral-800" />
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-[0.1em]">Current Season</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "SHADOW LINE",
                desc: "Our darkest collection. Monochromatic blacks, oversized silhouettes, heavy-gauge cotton. Inspired by brutalist architecture.",
                price: "€180–€680",
                pieces: "12 pieces",
              },
              {
                name: "ARCTIC TECH",
                desc: "Engineered for the cold metropolis. Gore-Tex shells, sealed seams, reflective detailing. Waterproof to 20,000mm.",
                price: "€245–€890",
                pieces: "8 pieces",
              },
              {
                name: "ORIGIN ESSENTIALS",
                desc: "The foundation. 450GSM organic cotton, garment-dyed in jet black. Cut for an oversized drape with ribbed details.",
                price: "€95–€320",
                pieces: "16 pieces",
              },
            ].map((collection, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="glass-panel-glow rounded-xl overflow-hidden group flex flex-col"
              >
                <div className="h-2 w-full bg-gradient-to-r from-neutral-800 to-brand-sky" />
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-display font-bold uppercase tracking-widest mb-4">{collection.name}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-8 flex-1">
                    {collection.desc}
                  </p>
                  
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-500 mb-8 pt-6 border-t border-white/5">
                    <span>{collection.pieces}</span>
                    <span>{collection.price}</span>
                  </div>

                  <Link
                    href="/shop"
                    className="flex items-center justify-between py-4 border border-white/10 rounded px-6 group-hover:border-brand-sky/50 transition-colors bg-white/5"
                    data-magnetic
                  >
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white group-hover:text-brand-sky transition-colors">
                      View Collection
                    </span>
                    <MoveRight className="w-4 h-4 text-white group-hover:text-brand-sky group-hover:translate-x-2 transition-all" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Research & Development */}
      <section className="py-24 px-6 md:px-12 bg-neutral-950 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-sky text-glow-sky">02</span>
                <div className="h-[1px] w-12 bg-brand-sky" />
                <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-[0.1em]">Research & Development</h2>
              </motion.div>
              
              <motion.p variants={fadeUp} className="text-neutral-400 text-sm md:text-base leading-relaxed mb-12 max-w-lg">
                We believe in material honesty. Every fabric, zipper, and seam is scrutinized and tested. We source globally but manufacture locally, ensuring every garment meets our exacting standards for longevity and performance.
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Shield, title: "Hardware", desc: "YKK Excella zippers, brushed chrome aglets." },
                  { icon: Leaf, title: "Sustainable", desc: "GOTS certified organic cotton, recycled polyester." },
                  { icon: Beaker, title: "Sourcing", desc: "14oz selvedge denim, Japanese fabrics." },
                ].map((item, idx) => (
                  <motion.div key={idx} variants={fadeUp} className="p-6 glass-panel rounded-lg border border-white/5">
                    <item.icon className="w-6 h-6 text-brand-sky mb-4" />
                    <h4 className="text-xs uppercase tracking-widest font-bold mb-2">{item.title}</h4>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div variants={fadeUp} className="relative h-[600px] rounded-2xl overflow-hidden">
               <Image
                  src="/editorial-spread.png"
                  alt="Research"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/40" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Design Process */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="flex items-center gap-4 mb-16">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">03</span>
            <div className="h-[1px] w-12 bg-neutral-800" />
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-[0.1em]">Design Process</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Material Research", desc: "Sourcing premium fabrics globally for unique textures." },
              { num: "02", title: "Pattern Engineering", desc: "3D-modeled patterns for optimal drape and silhouette." },
              { num: "03", title: "Prototype Testing", desc: "200+ hours of wear testing per garment in urban spaces." },
              { num: "04", title: "Production", desc: "Small-batch manufacturing in Porto, Portugal." },
            ].map((step, idx) => (
              <motion.div key={idx} variants={fadeUp} className="relative">
                <span className="text-6xl font-display font-bold text-white/5 absolute -top-8 left-0 select-none">
                  {step.num}
                </span>
                <div className="pt-8 border-t border-neutral-900 relative">
                  <div className="absolute top-0 left-0 w-8 h-[1px] bg-brand-sky" />
                  <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-white mb-3">{step.title}</h4>
                  <p className="text-[13px] text-neutral-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
