"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, ChevronRight, Compass, Sparkles } from "lucide-react";
import Link from "next/link";
import DynamicBg from "@/components/DynamicBg";
import Header from "@/components/Header";
import ProductCanvas from "@/components/ProductCanvas";
import ProductGrid from "@/components/ProductGrid";
import Editorial from "@/components/Editorial";
import Footer from "@/components/Footer";
import HeroWaveCanvas from "@/components/HeroWaveCanvas";

export default function Home() {
  const [activeColor, setActiveColor] = useState("black");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const hoodieScale = {
    hidden: { opacity: 0, scale: 0.78, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.5 },
    },
  };

  return (
    <main className="relative min-h-screen bg-[#030305] text-white w-full overflow-hidden">
      
      {/* 2. Global Immersive Atmospheric Background */}
      <DynamicBg />

      {/* 3. Global Floating Header */}
      <Header />

      {/* 4. Full-Screen Interactive Hero Section */}
      <section className="relative w-full min-h-screen flex items-center px-6 md:px-12 pt-28 md:pt-0">
        {/* Premium Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-editorial.png"
            alt="AURA STREET Hero"
            fill
            className="object-cover opacity-25 mix-blend-luminosity"
            priority
          />
          <HeroWaveCanvas />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030305] via-[#030305]/85 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030305]/30 to-[#030305] z-10" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Content Left */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 flex flex-col justify-center text-left pt-12 md:pt-0"
          >
            {/* Drop Status Tagline */}
            <motion.div variants={itemFadeUp} className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#00D2FF] text-glow-sky" />
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[9px] uppercase tracking-[0.3em] text-[#00D2FF] font-mono font-bold shadow-[0_0_12px_rgba(0,210,255,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse" />
                Drop 01 // Now Available
              </span>
            </motion.div>

            {/* Title Header */}
            <motion.h1 
              variants={itemFadeUp}
              className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-[0.12em] leading-[1.02] font-display mb-6 text-white text-glow-white"
            >
              AURA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-500">
                STREET
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemFadeUp}
              className="text-xs sm:text-sm text-neutral-300 max-w-md tracking-wider leading-relaxed mb-10 font-mono"
            >
              A synthesis of structural geometry and high-end fabric engineering. Experience our signature 450GSM matte streetwear hoodie with physical wrinkle styling and dynamic PBR studio lighting.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemFadeUp}
              className="flex flex-wrap items-center gap-4 mb-14"
            >
              <Link
                href="/shop"
                className="px-8 py-4 bg-white text-black hover:bg-[#00D2FF] hover:text-black rounded-xl text-[10px] uppercase tracking-[0.25em] font-extrabold flex items-center gap-2 group active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(0,210,255,0.4)]"
                data-magnetic
              >
                <span>Shop Collection</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                href="/editorial"
                className="px-8 py-4 rounded-xl border border-white/15 bg-white/[0.03] hover:border-[#00D2FF]/50 hover:bg-white/[0.08] text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-200 hover:text-white active:scale-95 transition-all duration-300 flex items-center gap-2 backdrop-blur-md"
                data-magnetic
              >
                <Compass className="w-4 h-4 text-[#00D2FF]" />
                <span>View Editorial</span>
              </Link>
            </motion.div>

            {/* Technical Specifications highlights */}
            <motion.div
              variants={itemFadeUp}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg text-[9px] uppercase tracking-[0.2em] font-mono"
            >
              <div className="glass-panel p-3.5 rounded-xl border border-white/10">
                <span className="block text-white font-bold mb-1">Heavy Weave</span>
                <span className="text-neutral-400">450GSM Cotton</span>
              </div>
              <div className="glass-panel p-3.5 rounded-xl border border-white/10">
                <span className="block text-white font-bold mb-1">Tailored Fit</span>
                <span className="text-neutral-400">Oversized Cut</span>
              </div>
              <div className="glass-panel p-3.5 rounded-xl border border-white/10">
                <span className="block text-white font-bold mb-1">Studio Light</span>
                <span className="text-neutral-400">PBR Shading</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero R3F 3D Canvas Right */}
          <motion.div
            variants={hoodieScale}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 h-[50vh] sm:h-[60vh] lg:h-[80vh] w-full flex items-center justify-center relative"
          >
            {/* Soft subtle background glow behind the hoodie */}
            <div className="absolute w-[75%] h-[75%] rounded-full bg-[#00D2FF]/[0.04] blur-[140px] pointer-events-none select-none" />
            
            <ProductCanvas color={activeColor} />

            {/* Color Configurator floating pill panel */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3.5 bg-[#0a0a0e]/90 border border-white/15 backdrop-blur-2xl rounded-full px-5 py-2.5 z-20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-neutral-400 mr-1 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#00D2FF]" /> SPEC:
              </span>
              {[
                { id: "black", label: "Jet Black", color: "bg-[#111111] border-neutral-700" },
                { id: "white", label: "Arctic White", color: "bg-[#dfdfdf] border-neutral-300" },
                { id: "blue", label: "Shadow Blue", color: "bg-[#1b2d42] border-sky-800" },
                { id: "red", label: "Crimson Core", color: "bg-[#561313] border-red-900" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveColor(c.id)}
                  title={c.label}
                  className={`w-6 h-6 rounded-full border transition-all duration-300 relative cursor-pointer flex items-center justify-center active:scale-95 ${c.color} ${
                    activeColor === c.id ? "scale-110 border-[#00D2FF] ring-2 ring-[#00D2FF]/40 shadow-[0_0_12px_#00D2FF]" : "opacity-60 border-transparent hover:opacity-100"
                  }`}
                  aria-label={`Select ${c.label} colorway`}
                >
                  {activeColor === c.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] absolute" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Scroll Indicator (Bottom Center) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 text-neutral-400">
          <span className="text-[8px] uppercase tracking-[0.3em] font-bold font-mono">
            Scroll to Explore
          </span>
          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="p-2 border border-white/10 rounded-full hover:border-[#00D2FF] active:scale-95 transition-all cursor-pointer bg-white/[0.02]"
            data-magnetic
            onClick={() => {
              const el = document.getElementById("shop");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#00D2FF]" />
          </motion.div>
        </div>
      </section>

      {/* 5. Products catalog section */}
      <ProductGrid />

      {/* 6. Editorial Philosophy section */}
      <Editorial />

      {/* 7. Footer section */}
      <Footer />

    </main>
  );
}
