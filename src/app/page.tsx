"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, ChevronRight, Compass } from "lucide-react";
import Link from "next/link";
import DynamicBg from "@/components/DynamicBg";
import Header from "@/components/Header";
import ProductCanvas from "@/components/ProductCanvas";
import ProductGrid from "@/components/ProductGrid";
import Editorial from "@/components/Editorial";
import Footer from "@/components/Footer";
import HeroWaveCanvas from "@/components/HeroWaveCanvas";

// ─── Countdown to next drop (cosmetic — 72 hours from now) ───
function useCountdown() {
  const targetRef = useRef(Date.now() + 72 * 3600 * 1000);
  const [time, setTime] = useState({ h: "72", m: "00", s: "00" });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, targetRef.current - Date.now());
      const h = Math.floor(diff / 3600000).toString().padStart(2, "0");
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
      setTime({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

const MARQUEE_TEXT =
  "// 450GSM MATTE COTTON // OVERSIZED SILHOUETTE // PBR STUDIO LIGHTING // PARIS-ORIGINATED // DROP 01 LIVE // ENZYME-WASHED FINISH // HEAVY WEAVE CONSTRUCTION // ARCHITECTURAL FIT // LUXURY HARDWARE // ";

export default function Home() {
  const [activeColor, setActiveColor] = useState("black");
  const countdown = useCountdown();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
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

  const COLORS = [
    { id: "black", label: "Jet Black", color: "bg-[#111111] border-neutral-700" },
    { id: "white", label: "Arctic White", color: "bg-[#dfdfdf] border-neutral-300" },
    { id: "blue", label: "Shadow Blue", color: "bg-[#1b2d42] border-sky-800" },
    { id: "red", label: "Crimson Core", color: "bg-[#561313] border-red-900" },
  ];

  return (
    <main className="relative min-h-screen bg-[#030305] text-white w-full overflow-hidden">

      {/* Global Atmospheric Background */}
      <DynamicBg />

      {/* Fixed Header */}
      <Header />

      {/* ── Hero Section ── */}
      <section className="relative w-full min-h-screen flex items-center px-6 md:px-12 pt-28 md:pt-0">

        {/* Premium Background Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-editorial.png"
            alt="AURA STREET Drop 01 editorial backdrop"
            fill
            className="object-cover opacity-20 mix-blend-luminosity"
            priority
          />
          <HeroWaveCanvas />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030305] via-[#030305]/88 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030305]/25 to-[#030305] z-10" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* ── LEFT: Hero Copy ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 flex flex-col justify-center text-left pt-12 md:pt-0"
          >
            {/* Live Drop Status Badge */}
            <motion.div variants={itemFadeUp} className="flex items-center gap-3 mb-5">
              <span className="w-8 h-[1px] bg-[#00D2FF] text-glow-sky" />
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[9px] uppercase tracking-[0.3em] text-[#00D2FF] font-mono font-bold shadow-[0_0_16px_rgba(0,210,255,0.2)] animate-ring-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse" />
                Drop 01 // Now Live
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemFadeUp}
              className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-[0.12em] leading-[1.02] font-display mb-5 text-white text-glow-white"
            >
              AURA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-500">
                STREET
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemFadeUp}
              className="text-xs sm:text-sm text-neutral-300 max-w-md tracking-wider leading-relaxed mb-7 font-mono"
            >
              A synthesis of structural geometry and high-end fabric engineering. 450GSM matte streetwear with physical wrinkle styling and dynamic PBR studio lighting.
            </motion.p>

            {/* Countdown Timer */}
            <motion.div variants={itemFadeUp} className="flex items-center gap-2 mb-8">
              <div className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-mono mr-2">Next Drop In</span>
                {[countdown.h, countdown.m, countdown.s].map((unit, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="text-base font-black font-mono text-white tabular-nums">
                      {unit}
                    </span>
                    {i < 2 && <span className="text-[#00D2FF] font-bold text-sm animate-pulse">:</span>}
                  </span>
                ))}
              </div>
              <span className="text-[8px] uppercase tracking-[0.2em] text-neutral-600 font-mono">
                HH : MM : SS
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemFadeUp} className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href="/shop"
                className="glow-btn px-8 py-4 bg-white text-black hover:bg-[#00D2FF] hover:text-black rounded-xl text-[10px] uppercase tracking-[0.25em] font-extrabold flex items-center gap-2 group active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.12)] hover:shadow-[0_0_35px_rgba(0,210,255,0.45)]"
                data-magnetic
              >
                <span>Shop Collection</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                href="/editorial"
                className="px-8 py-4 rounded-xl border border-white/15 bg-white/[0.03] hover:border-[#00D2FF]/50 hover:bg-white/[0.07] text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-200 hover:text-white active:scale-95 transition-all duration-300 flex items-center gap-2 backdrop-blur-md"
                data-magnetic
              >
                <Compass className="w-4 h-4 text-[#00D2FF]" />
                <span>View Editorial</span>
              </Link>
            </motion.div>

            {/* Technical Spec Badges */}
            <motion.div
              variants={itemFadeUp}
              className="grid grid-cols-3 gap-3 pt-6 border-t border-white/8 max-w-lg"
            >
              {[
                { label: "Heavy Weave", sub: "450GSM Cotton" },
                { label: "Tailored Fit", sub: "Oversized Cut" },
                { label: "Studio Light", sub: "PBR Shading" },
              ].map(({ label, sub }) => (
                <div
                  key={label}
                  className="glass-panel p-3.5 rounded-xl border border-white/10 hover:border-[#00D2FF]/30 transition-colors duration-300 group"
                >
                  <span className="block text-white font-bold mb-1 text-[9px] uppercase tracking-[0.2em] font-mono group-hover:text-[#00D2FF] transition-colors">
                    {label}
                  </span>
                  <span className="text-neutral-400 text-[8px] uppercase tracking-[0.15em] font-mono">
                    {sub}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: 3D Canvas + Floating Badges ── */}
          <motion.div
            variants={hoodieScale}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 h-[40vh] sm:h-[50vh] lg:h-[72vh] w-full flex items-center justify-center relative"
          >
            {/* Stronger radial glow behind model */}
            <div className="absolute w-[80%] h-[80%] rounded-full bg-[#00D2FF]/[0.06] blur-[160px] pointer-events-none select-none animate-breathe" />
            <div className="absolute w-[50%] h-[50%] rounded-full bg-[#00D2FF]/[0.04] blur-[80px] pointer-events-none select-none" />

            <ProductCanvas color={activeColor} />

            {/* Floating Spec Label — Top Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-8 left-4 glass-panel border border-white/10 rounded-lg px-3 py-2 pointer-events-none"
            >
              <span className="block text-[8px] uppercase tracking-[0.25em] text-[#00D2FF] font-mono font-bold">
                450 GSM
              </span>
              <span className="block text-[7px] uppercase tracking-[0.15em] text-neutral-400 font-mono mt-0.5">
                Matte Cotton
              </span>
            </motion.div>

            {/* Floating Spec Label — Bottom Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-20 right-4 glass-panel border border-[#00D2FF]/20 rounded-lg px-3 py-2 pointer-events-none"
            >
              <span className="block text-[8px] uppercase tracking-[0.25em] text-white font-mono font-bold">
                DROP 01
              </span>
              <span className="flex items-center gap-1.5 text-[7px] uppercase tracking-[0.15em] text-[#00D2FF] font-mono mt-0.5">
                <span className="w-1 h-1 rounded-full bg-[#00D2FF] animate-pulse" />
                Now Live
              </span>
            </motion.div>

            {/* Color Configurator Pill */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3.5 bg-[#0a0a0e]/90 border border-white/15 backdrop-blur-2xl rounded-full px-5 py-2.5 z-20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-neutral-400 mr-1 font-mono">
                SPEC:
              </span>
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveColor(c.id)}
                  title={c.label}
                  className={`w-6 h-6 rounded-full border transition-all duration-300 relative cursor-pointer flex items-center justify-center active:scale-95 focus-visible:ring-2 focus-visible:ring-[#00D2FF] ${c.color} ${
                    activeColor === c.id
                      ? "scale-115 border-[#00D2FF] ring-2 ring-[#00D2FF]/40 shadow-[0_0_14px_#00D2FF]"
                      : "opacity-55 border-transparent hover:opacity-100 hover:scale-105"
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 text-neutral-400">
          <span className="text-[8px] uppercase tracking-[0.3em] font-bold font-mono">
            Scroll to Explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="p-2 border border-white/10 rounded-full hover:border-[#00D2FF] active:scale-95 transition-all cursor-pointer bg-white/[0.02]"
            data-magnetic
            role="button"
            tabIndex={0}
            aria-label="Scroll down to featured collection"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                const el = document.getElementById("shop");
                el?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            onClick={() => {
              const el = document.getElementById("shop");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#00D2FF]" />
          </motion.div>
        </div>
      </section>

      {/* ── Marquee Ticker Band ── */}
      <div className="relative z-10 w-full overflow-hidden border-t border-b border-white/[0.06] bg-[#030305] py-3">
        <div className="flex whitespace-nowrap w-max animate-ticker">
          {[MARQUEE_TEXT, MARQUEE_TEXT].map((text, i) => (
            <span
              key={i}
              className="text-[9px] uppercase tracking-[0.28em] font-mono font-bold text-neutral-500 mr-0"
              aria-hidden={i > 0}
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Products Catalog */}
      <ProductGrid />

      {/* Editorial Philosophy */}
      <Editorial />

      {/* Footer */}
      <Footer />

    </main>
  );
}
