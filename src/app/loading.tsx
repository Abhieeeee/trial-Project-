"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col items-center justify-center font-mono">
      <div className="flex flex-col items-center gap-6">
        
        {/* Pulsing Wordmark */}
        <motion.h1
          className="text-base tracking-[0.45em] text-white font-bold uppercase select-none"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          AURA.STREET
        </motion.h1>

        {/* Moving Laser Line Loader */}
        <div className="w-[180px] h-[1px] bg-white/10 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full w-[40px] bg-[#00D2FF]"
            animate={{ x: ["-40px", "180px"] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              boxShadow: "0 0 8px #00D2FF",
            }}
          />
        </div>

        {/* Loading details text */}
        <span className="text-[8px] uppercase tracking-[0.25em] text-neutral-600 select-none">
          SYSTEM LOADING
        </span>

      </div>
    </div>
  );
}
