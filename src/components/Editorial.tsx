"use client";

import { motion } from "framer-motion";

export default function Editorial() {
  const brandStatement = "WE SHAPE LIGHT AND SHADOW. MODERN GARMENTS FOR THE COLD METROPOLIS. DESIGNED IN SILENCE.";

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.04 },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0.08, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const specs = [
    { code: "MAT-01", label: "450GSM Cotton", detail: "Enzyme Washed // Matte Finish" },
    { code: "FIT-02", label: "Oversized Geometry", detail: "Dropped Shoulder // Boxy Cut" },
    { code: "HRW-03", label: "Luxury Hardware", detail: "YKK Zippers // Cast Metal" },
  ];

  return (
    <section
      id="editorial"
      className="py-32 md:py-44 bg-[#030305] relative z-10 overflow-hidden border-t border-white/[0.05] px-6 md:px-12 font-sans"
    >
      {/* Atmospheric left orb */}
      <div className="absolute top-1/2 left-[-8%] -translate-y-1/2 w-[45%] h-[60%] rounded-full bg-[#00D2FF]/[0.03] blur-[200px] pointer-events-none" />
      {/* Atmospheric right orb */}
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[40%] rounded-full bg-blue-900/[0.04] blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">

        {/* Label */}
        <div className="flex items-center gap-3 mb-10">
          <span className="w-8 h-[1px] bg-[#00D2FF]" />
          <p className="text-[9px] uppercase tracking-[0.32em] text-[#00D2FF] font-bold font-mono">
            Brand Philosophy // 001
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left: Big Staggered Statement */}
          <div className="lg:col-span-8">
            <motion.h3
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.1em] leading-[1.22] font-display text-white text-glow-white mb-14"
            >
              {brandStatement.split(" ").map((word, idx) => (
                <span key={idx} className="inline-block mr-[0.3em] overflow-hidden">
                  <motion.span variants={wordVariants} className="inline-block">
                    {word}
                  </motion.span>
                </span>
              ))}
            </motion.h3>

            {/* 3-Column Material Spec Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {specs.map(({ code, label, detail }) => (
                <div
                  key={code}
                  className="glass-panel-glow border border-white/[0.07] hover:border-[#00D2FF]/25 rounded-2xl p-5 flex flex-col gap-3 group transition-all duration-400"
                >
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#00D2FF] font-mono font-bold">{code}</span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-white font-black font-display group-hover:text-[#00D2FF] transition-colors duration-300">{label}</span>
                  <span className="text-[9px] uppercase tracking-[0.15em] text-neutral-500 font-mono leading-relaxed">{detail}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Philosophy Card + Spinning Badge */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="p-8 rounded-2xl glass-panel-glow border border-white/[0.09] bg-[#0a0a0e]/90 flex flex-col gap-6 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_20px_50px_rgba(0,0,0,0.95)]"
            >
              <h4 className="text-[11px] uppercase tracking-[0.28em] font-extrabold text-white border-b border-white/[0.07] pb-3.5 font-mono flex items-center justify-between">
                <span>The Aesthetic</span>
                <span className="text-[#00D2FF] text-[8px] tracking-[0.2em]">LUXURY CUT</span>
              </h4>
              <p className="text-xs text-neutral-300 tracking-wide leading-[1.8] font-mono">
                AURA STREET is a synthesis of architectural precision and raw subculture. We create armor for the modern nomad. Every piece is engineered with premium construction, oversized geometry, and structural balance.
              </p>
              <p className="text-xs text-neutral-400 tracking-wide leading-[1.8] font-mono">
                Synthesizing elements from luxury tailoring, structural design, and technical sportswear. We do not chase trends. We define forms.
              </p>
              {/* Horizontal divider with logo mark */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex-1 h-[1px] bg-white/[0.06]" />
                <span className="text-[8px] uppercase tracking-[0.35em] text-[#00D2FF] font-mono font-bold">AS</span>
                <div className="flex-1 h-[1px] bg-white/[0.06]" />
              </div>
            </motion.div>

            {/* Rotating Stamp Badge */}
            <div className="flex items-center gap-6 self-start pl-2">
              <div className="relative w-[72px] h-[72px] rounded-full border border-white/12 flex items-center justify-center pointer-events-none select-none bg-black/50 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <svg className="w-14 h-14 animate-[spin_14s_linear_infinite]" viewBox="0 0 100 100" aria-hidden="true">
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="transparent"
                  />
                  <text className="text-[7.5px] uppercase fill-neutral-400 font-bold tracking-[0.16em]">
                    <textPath href="#circlePath">
                      * aura street * premium fabric engineering
                    </textPath>
                  </text>
                </svg>
                {/* Pulsing center dot — upgraded */}
                <div className="absolute w-3 h-3 bg-[#00D2FF] rounded-full animate-ring-pulse shadow-[0_0_16px_#00D2FF,0_0_30px_rgba(0,210,255,0.4)]" />
              </div>

              <div className="flex flex-col font-mono">
                <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-white">
                  Origin Code
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#00D2FF] font-semibold mt-1">
                  48.8566° N, 2.3522° E
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-neutral-500 font-mono mt-1.5">
                  Paris, France
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
