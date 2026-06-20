"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

export default function Editorial() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const imageReveal = {
    hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
    show: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <main className="relative min-h-screen bg-black text-white w-full overflow-hidden">
      <CustomCursor />
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col justify-end pb-24 px-6 md:px-12 pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/editorial-spread.png"
            alt="Editorial Spread"
            fill
            className="object-cover object-top opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="relative z-10 max-w-7xl mx-auto w-full"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Editorial</span>
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-6xl md:text-9xl font-extrabold uppercase tracking-[0.05em] font-display text-white mb-6 drop-shadow-2xl">
            THE EDITORIAL
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-sm md:text-lg text-neutral-300 max-w-xl font-light tracking-wide border-l border-brand-sky pl-6">
            Stories of shadow, structure, and silence. Documenting the intersection of brutalist design and premium textiles.
          </motion.p>
        </motion.div>
      </section>

      {/* Article 1: THE ART OF DARKNESS */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
            className="order-2 lg:order-1"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">Vol. 01</span>
              <div className="h-[1px] w-8 bg-neutral-800" />
            </motion.div>
            
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-display font-bold uppercase tracking-[0.1em] mb-12">
              The Art of <br /><span className="text-brand-sky">Darkness</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-sm md:text-base text-neutral-400 leading-relaxed mb-8">
              In the quiet hours between dusk and dawn, AURA STREET finds its voice. Our design philosophy draws from the spaces between — the negative space in brutalist architecture, the silence between musical notes, the pause between breaths.
            </motion.p>
            
            <motion.p variants={fadeUp} className="text-sm md:text-base text-neutral-400 leading-relaxed mb-12">
              Each garment is a meditation on restraint. We strip away the unnecessary until only the essential remains. The result is clothing that speaks through its absence of noise.
            </motion.p>

            <motion.div variants={fadeUp} className="flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold border-l-2 border-brand-sky pl-4">
              <div>
                <span className="block text-white mb-1">Author</span>
                <span>Émile Leclerc</span>
              </div>
              <div>
                <span className="block text-white mb-1">Date</span>
                <span>SS26</span>
              </div>
              <div>
                <span className="block text-white mb-1">Read Time</span>
                <span>8 Min</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={imageReveal}
            className="order-1 lg:order-2 relative aspect-[4/5] rounded-xl overflow-hidden glass-panel-glow"
          >
            <Image
              src="/hero-editorial.png"
              alt="Art of Darkness"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Article 2: FABRIC AS ARCHITECTURE */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={imageReveal}
            className="relative aspect-[4/5] rounded-xl overflow-hidden glass-panel-glow"
          >
            <Image
              src="/collections-banner.png"
              alt="Fabric Architecture"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">Vol. 02</span>
              <div className="h-[1px] w-8 bg-neutral-800" />
            </motion.div>
            
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-display font-bold uppercase tracking-[0.1em] mb-12">
              Fabric as <br />Architecture
            </motion.h2>

            <motion.p variants={fadeUp} className="text-sm md:text-base text-neutral-400 leading-relaxed mb-8">
              Every thread in an AURA STREET garment serves a structural purpose. Our 450GSM organic cotton is sourced from family-owned mills in Osaka, Japan — where textile craftsmanship spans seven generations.
            </motion.p>
            
            <motion.p variants={fadeUp} className="text-sm md:text-base text-neutral-400 leading-relaxed mb-12">
              The weight of the fabric isn't just about warmth; it's about how a garment holds its shape, how it drapes across the body, how it moves through space. We engineer our patterns using 3D body-scanning technology, creating silhouettes that are both oversized and precise. The paradox is intentional: comfort without compromise, volume without excess.
            </motion.p>

            <motion.div variants={fadeUp} className="flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold border-l-2 border-white/20 pl-4">
              <div>
                <span className="block text-white mb-1">Research</span>
                <span>Yuki Tanaka</span>
              </div>
              <div>
                <span className="block text-white mb-1">Date</span>
                <span>SS26</span>
              </div>
              <div>
                <span className="block text-white mb-1">Read Time</span>
                <span>12 Min</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Article 3: THE METROPOLIS COLLECTION */}
      <section className="py-32 px-6 md:px-12 bg-neutral-950 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.span variants={fadeUp} className="block text-[10px] uppercase tracking-[0.3em] font-bold text-brand-sky text-glow-sky mb-8">
              The Metropolis Manifesto
            </motion.span>
            
            <motion.blockquote variants={fadeUp} className="text-2xl md:text-4xl font-display font-light leading-relaxed mb-16 text-white/90">
              "The city is our runway. From the concrete canyons of Tokyo's Shibuya district to the rain-slicked streets of East London, AURA STREET garments are designed to perform in the urban environment."
            </motion.blockquote>

            <motion.p variants={fadeUp} className="text-sm md:text-base text-neutral-400 leading-relaxed mb-16 max-w-2xl mx-auto">
              Our Gore-Tex Tech shells withstand 20,000mm water column pressure. Our reinforced seams endure 100,000+ flex cycles. Our reflective detailing catches light at exactly 15 degrees of incidence — engineered visibility for the night walker. This is functional luxury: every detail justified, every feature earned.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { stat: "20,000mm", label: "Water Resistance" },
                { stat: "100K+", label: "Flex Cycles" },
                { stat: "15°", label: "Reflective Angle" },
              ].map((item, idx) => (
                <motion.div key={idx} variants={fadeUp} className="p-8 glass-panel border border-white/5 rounded-xl">
                  <div className="text-3xl font-display font-bold text-brand-sky mb-2">{item.stat}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 md:px-12 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-display font-bold uppercase tracking-[0.1em] mb-4">JOIN THE EDITORIAL</h2>
          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-10">Receive exclusive stories, private collection access, and brand news.</p>
          
          <form className="relative flex max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="YOUR EMAIL ADDRESS" 
              className="w-full bg-transparent border-b border-neutral-700 py-4 px-2 text-xs uppercase tracking-widest focus:outline-none focus:border-brand-sky transition-colors text-white placeholder:text-neutral-600"
            />
            <button 
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-neutral-500 hover:text-brand-sky transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
