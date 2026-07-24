"use client";

import { useState } from "react";
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

export default function Home() {
  const [activeColor, setActiveColor] = useState("black");
  // Animation Orchestration Variants
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
    <main className="relative min-h-screen bg-black text-white w-full overflow-hidden">
      
      {/* 2. Global Immersive Atmospheric Background */}
      <DynamicBg />

      {/* 3. Global Floating Header */}
      <Header />

      {/* 4. Full-Screen Interactive Hero Section */}
      <section className="relative w-full min-h-screen flex items-center px-6 md:px-12 pt-24 md:pt-0">
        {/* Premium Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-editorial.png"
            alt="AURA STREET Hero"
            fill
            className="object-cover opacity-30 mix-blend-luminosity"
            priority
          />
          <HeroWaveCanvas />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/25 to-black z-10" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Content Left */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 flex flex-col justify-center text-left"
          >
            {/* Tagline label */}
            <motion.div variants={itemFadeUp} className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-brand-sky text-glow-sky" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-brand-sky text-glow-sky font-bold">
                Drop 01 // Now Available
              </span>
            </motion.div>

            {/* Giant Title */}
            <motion.h1 
              variants={itemFadeUp}
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase tracking-wider leading-[1.05] font-display mb-6 text-white"
            >
              AURA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400">
                STREET
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemFadeUp}
              className="text-xs md:text-sm text-neutral-400 max-w-md tracking-wide leading-relaxed mb-10"
            >
              A blend of structural geometry and high-end fabric engineering. Explore our signature 450GSM matte black hoodie, featuring physical wrinkle styling and dynamic studio lighting.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemFadeUp}
              className="flex flex-wrap items-center gap-4 mb-14"
            >
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-white text-black hover:bg-[#00D2FF] hover:text-black rounded-lg text-[10px] uppercase tracking-[0.25em] font-extrabold flex items-center gap-2 group transition-all duration-300 shadow-xl shadow-white/5"
                data-magnetic
              >
                <span>Shop Collection</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                href="/editorial"
                className="px-8 py-3.5 rounded-lg border border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.05] text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-300 hover:text-white transition-all duration-300 flex items-center gap-2"
                data-magnetic
              >
                <Compass className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>View Editorial</span>
              </Link>
            </motion.div>

            {/* Technical Specifications highlights */}
            <motion.div
              variants={itemFadeUp}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5 max-w-lg text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium"
            >
              <div>
                <span className="block text-white font-semibold mb-1">Heavy Weave</span>
                <span>450GSM Cotton</span>
              </div>
              <div>
                <span className="block text-white font-semibold mb-1">Tailored Fit</span>
                <span>Oversized Cut</span>
              </div>
              <div>
                <span className="block text-white font-semibold mb-1">Studio Lighting</span>
                <span>PBR Materials</span>
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
            <div className="absolute w-[70%] h-[70%] rounded-full bg-[#00D2FF]/[0.03] blur-[120px] pointer-events-none select-none" />
            
            <ProductCanvas color={activeColor} />

            {/* Color Configurator floating pill panel */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-neutral-950/80 border border-white/10 backdrop-blur-xl rounded-full px-4 py-2 z-20 shadow-2xl">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-neutral-400 mr-1 font-mono">SPEC:</span>
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
                  className={`w-5 h-5 rounded-full border transition-all duration-300 relative cursor-pointer flex items-center justify-center ${c.color} ${
                    activeColor === c.id ? "scale-110 border-[#00D2FF] ring-2 ring-[#00D2FF]/30" : "opacity-60 border-transparent hover:opacity-100"
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 text-neutral-500">
          <span className="text-[8px] uppercase tracking-[0.3em] font-semibold">
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
            className="p-1.5 border border-neutral-900 rounded-full hover:border-brand-sky/20 transition-colors cursor-pointer"
            data-magnetic
            onClick={() => {
              const el = document.getElementById("shop");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <ArrowDown className="w-3.5 h-3.5" />
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
