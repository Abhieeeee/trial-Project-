"use client";

import { motion } from "framer-motion";

export default function Editorial() {
  const brandStatement = "WE SHAPE LIGHT AND SHADOW. MODERN GARMENTS FOR THE COLD METROPOLIS. DESIGNED IN SILENCE.";

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0.1, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section id="editorial" className="py-32 md:py-40 bg-[#030305] relative z-10 overflow-hidden border-t border-white/10 px-6 md:px-12 font-sans">
      
      {/* Background visual detail */}
      <div className="absolute top-1/2 left-[-10%] w-[50%] h-[50%] rounded-full bg-[#00D2FF]/[0.03] blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Big Staggered Typography Statement */}
        <div className="lg:col-span-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#00D2FF] text-glow-sky mb-6 font-bold font-mono flex items-center gap-2">
            <span className="w-6 h-[1px] bg-[#00D2FF]" />
            Brand Philosophy // 001
          </p>
          
          <motion.h3
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.1em] leading-[1.2] font-display text-white text-glow-white"
          >
            {brandStatement.split(" ").map((word, idx) => (
              <span key={idx} className="inline-block mr-3 md:mr-4 overflow-hidden">
                <motion.span variants={wordVariants} className="inline-block">
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h3>
        </div>

        {/* Right Column: Editorial Text & Spin Badge */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }}
            className="p-8 rounded-2xl glass-panel-glow border-white/10 bg-[#0a0a0e]/90 flex flex-col gap-6 backdrop-blur-2xl shadow-2xl"
          >
            <h4 className="text-[11px] uppercase tracking-[0.25em] font-extrabold text-white border-b border-white/10 pb-3 font-mono flex items-center justify-between">
              <span>The Aesthetic</span>
              <span className="text-[#00D2FF] text-[9px]">LUXURY CUT</span>
            </h4>
            <p className="text-xs text-neutral-300 tracking-wide leading-relaxed font-mono">
              AURA STREET is a synthesis of architectural precision and raw subculture. We create armor for the modern nomad. Every piece is engineered with premium construction, oversized geometry, and structural balance.
            </p>
            <p className="text-xs text-neutral-400 tracking-wide leading-relaxed font-mono">
              Synthesizing elements from luxury tailoring, structural design, and technical sportswear. We do not chase trends. We define forms.
            </p>
          </motion.div>

          {/* Luxury rotating digital stamp badge */}
          <div className="flex items-center gap-6 self-start lg:self-auto pl-2">
            <div className="relative w-16 h-16 rounded-full border border-white/15 flex items-center justify-center pointer-events-none select-none bg-black/40">
              <svg className="w-12 h-12 animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
                <path
                  id="circlePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="transparent"
                />
                <text className="text-[7.5px] uppercase fill-neutral-400 font-bold tracking-[0.16em]">
                  <textPath xlinkHref="#circlePath">
                    * aura street * premium fabric engineering
                  </textPath>
                </text>
              </svg>
              <div className="absolute w-2.5 h-2.5 bg-[#00D2FF] rounded-full text-glow-sky shadow-[0_0_10px_#00D2FF]" />
            </div>
            <div className="flex flex-col font-mono">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">
                Origin Code
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#00D2FF] font-semibold mt-0.5">
                48.8566° N, 2.3522° E
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
