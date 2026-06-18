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
    <section id="editorial" className="py-40 bg-black relative z-10 overflow-hidden border-t border-neutral-950 px-6 md:px-12">
      
      {/* Background visual detail */}
      <div className="absolute top-1/2 left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-sky/2 blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Big Staggered Typography Statement */}
        <div className="lg:col-span-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-sky text-glow-sky mb-6 font-semibold">
            Brand Philosophy // 001
          </p>
          
          <motion.h3
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-[0.1em] leading-[1.2] font-display text-white"
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
            className="p-8 rounded-xl glass-panel-glow border-neutral-900 bg-neutral-950/20 flex flex-col gap-6"
          >
            <h4 className="text-[11px] uppercase tracking-[0.25em] font-bold text-white border-b border-neutral-900 pb-3">
              The Aesthetic
            </h4>
            <p className="text-xs text-neutral-400 tracking-wide leading-relaxed">
              AURA STREET is a synthesis of architectural precision and raw subculture. We create armor for the modern nomad. Every piece is engineered with premium construction, oversized geometry, and structural balance.
            </p>
            <p className="text-xs text-neutral-500 tracking-wide leading-relaxed">
              Synthesizing elements from luxury tailoring, structural design, and technical sportswear. We do not chase trends. We define forms.
            </p>
          </motion.div>

          {/* Luxury rotating digital stamp badge */}
          <div className="flex items-center gap-6 self-start lg:self-auto pl-4">
            <div className="relative w-16 h-16 rounded-full border border-neutral-800 flex items-center justify-center pointer-events-none select-none">
              <svg className="w-12 h-12 animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
                <path
                  id="circlePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="transparent"
                />
                <text className="text-[7.5px] uppercase fill-neutral-500 font-bold tracking-[0.16em]">
                  <textPath xlinkHref="#circlePath">
                    * aura street * premium fabric engineering
                  </textPath>
                </text>
              </svg>
              <div className="absolute w-2 h-2 bg-brand-sky rounded-full text-glow-sky" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">
                Origin Code
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-mono mt-0.5">
                48.8566° N, 2.3522° E
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
