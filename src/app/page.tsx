"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, ChevronRight, Compass } from "lucide-react";
import Link from "next/link";
import DynamicBg from "@/components/DynamicBg";
import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import ProductCanvas from "@/components/ProductCanvas";
import ProductGrid from "@/components/ProductGrid";
import Editorial from "@/components/Editorial";
import Footer from "@/components/Footer";
import HeroWaveCanvas from "@/components/HeroWaveCanvas";

export default function Home() {
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
      
      {/* 1. Global Custom Animated Cursor */}
      <CustomCursor />

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
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase tracking-[0.12em] leading-[1.05] font-display mb-6 text-white"
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
              className="flex flex-wrap items-center gap-5 mb-16"
            >
              <Link
                href="/shop"
                className="px-8 py-4 bg-white text-black hover:bg-brand-sky hover:text-black rounded text-[10px] uppercase tracking-[0.25em] font-extrabold flex items-center gap-2 group transition-all duration-300 shadow-lg shadow-white/5"
                data-magnetic
              >
                <span>Shop Collection</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                href="/editorial"
                className="px-8 py-4 rounded border border-neutral-900 bg-neutral-950/20 hover:border-brand-sky hover:bg-neutral-950/60 text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-400 hover:text-white transition-all duration-300 flex items-center gap-2"
                data-magnetic
              >
                <Compass className="w-3.5 h-3.5 text-brand-sky text-glow-sky" />
                <span>View Editorial</span>
              </Link>
            </motion.div>

            {/* Technical Specifications highlights */}
            <motion.div
              variants={itemFadeUp}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-950 max-w-lg text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-semibold"
            >
              <div>
                <span className="block text-white mb-1">Heavy Weave</span>
                <span>450GSM Cotton</span>
              </div>
              <div>
                <span className="block text-white mb-1">Tailored Fit</span>
                <span>Oversized Cut</span>
              </div>
              <div>
                <span className="block text-white mb-1">Studio Lighting</span>
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
            {/* Circular background light halo behind the hoodie */}
            <div className="absolute w-[80%] h-[80%] rounded-full bg-brand-sky/3 blur-[100px] pointer-events-none select-none" />
            
            <ProductCanvas />
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
