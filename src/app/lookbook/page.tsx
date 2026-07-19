"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

const looks = [
  { image: "/hero-editorial.png", label: "Look 01 // Heavy Fleece Outline" },
  { image: "/collections-banner.png", label: "Look 02 // Arctic Tech Shell" },
  { image: "/editorial-spread.png", label: "Look 03 // Studio Shadow Drape" },
  { image: "/moto-jacket.png", label: "Look 04 // Calf Leather Moto" },
  { image: "/tech-cargos.png", label: "Look 05 // Modular Cargo Shell" },
  { image: "/street-sneaker.png", label: "Look 06 // Street Runner Platform" },
];

export default function LookbookPage() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const handleNext = () => {
    if (activeIdx !== null) {
      setActiveIdx((activeIdx + 1) % looks.length);
    }
  };

  const handlePrev = () => {
    if (activeIdx !== null) {
      setActiveIdx((activeIdx - 1 + looks.length) % looks.length);
    }
  };

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto py-12">
        <PageIntro
          eyebrow="Lookbook"
          title="Campaign Editorial looks"
          text="A visual index for campaign styling, product storytelling, and social-first outfit direction."
        />
        
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.08 } }
          }}
          className="px-6 md:px-12 max-w-7xl mx-auto pb-28 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {looks.map((look, index) => (
            <motion.figure 
              key={look.label}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
              }}
              onClick={() => setActiveIdx(index)}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden glass-panel-glow cursor-pointer"
            >
              <Image 
                src={look.image} 
                alt={look.label} 
                fill 
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[800ms] ease-out" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform duration-300">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
              <figcaption className="absolute left-5 bottom-5 text-[9px] uppercase tracking-[0.24em] text-white bg-black/60 border border-white/10 rounded px-3 py-2 font-mono">
                {look.label}
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {activeIdx !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 backdrop-blur-md"
            >
              <button 
                onClick={() => setActiveIdx(null)}
                className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <button 
                onClick={handlePrev}
                className="absolute left-4 md:left-8 text-neutral-400 hover:text-white transition-colors p-2 bg-neutral-900/50 hover:bg-neutral-900 rounded-full cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="relative max-w-4xl w-full h-[70vh] md:h-[80vh] flex flex-col items-center justify-center">
                <motion.div 
                  key={activeIdx}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image 
                    src={looks[activeIdx].image} 
                    alt={looks[activeIdx].label} 
                    fill 
                    className="object-contain" 
                  />
                </motion.div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/80 font-mono mt-4 text-center">
                  {looks[activeIdx].label}
                </p>
              </div>

              <button 
                onClick={handleNext}
                className="absolute right-4 md:right-8 text-neutral-400 hover:text-white transition-colors p-2 bg-neutral-900/50 hover:bg-neutral-900 rounded-full cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
