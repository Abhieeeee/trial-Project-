"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ruler, Info, RefreshCw } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

type Category = "Tops" | "Outerwear" | "Pants" | "Footwear";
type Unit = "IN" | "CM";

const sizeCharts: Record<Category, { headers: string[]; data: Record<string, number[]> }> = {
  Tops: {
    headers: ["Chest", "Length", "Sleeve"],
    data: {
      S: [96, 68, 62],
      M: [102, 72, 64],
      L: [108, 76, 66],
      XL: [114, 80, 68],
    }
  },
  Outerwear: {
    headers: ["Chest", "Length", "Sleeve"],
    data: {
      S: [98, 70, 64],
      M: [104, 74, 66],
      L: [110, 78, 68],
      XL: [116, 82, 70],
    }
  },
  Pants: {
    headers: ["Waist", "Inseam", "Outseam"],
    data: {
      "28": [71, 76, 102],
      "30": [76, 78, 104],
      "32": [81, 80, 106],
      "34": [86, 82, 108],
    }
  },
  Footwear: {
    headers: ["EU Size", "US Size", "Foot Length (mm)"],
    data: {
      "40": [40, 7.5, 255],
      "41": [41, 8.5, 260],
      "42": [42, 9.5, 265],
      "43": [43, 10.5, 270],
      "44": [44, 11.5, 275],
    }
  }
};

export default function SizingPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Tops");
  const [unit, setUnit] = useState<Unit>("CM");

  // Recommendation calculator parameters
  const [userMeasurement, setUserMeasurement] = useState<number | "">("");
  const [calculatedSize, setCalculatedSize] = useState<string | null>(null);

  const formatVal = (val: number) => {
    if (activeCategory === "Footwear") return val.toString();
    if (unit === "IN") {
      return `${(val / 2.54).toFixed(1)} in`;
    }
    return `${val} cm`;
  };

  const handleRecommend = () => {
    if (!userMeasurement) return;
    const measurement = Number(userMeasurement);
    
    if (activeCategory === "Tops" || activeCategory === "Outerwear") {
      if (measurement <= 98) setCalculatedSize("S");
      else if (measurement <= 104) setCalculatedSize("M");
      else if (measurement <= 110) setCalculatedSize("L");
      else setCalculatedSize("XL");
    } else if (activeCategory === "Pants") {
      if (measurement <= 73) setCalculatedSize("28");
      else if (measurement <= 78) setCalculatedSize("30");
      else if (measurement <= 83) setCalculatedSize("32");
      else setCalculatedSize("34");
    } else {
      setCalculatedSize("Direct EU sizing recommended");
    }
  };

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto py-12">
        <PageIntro
          eyebrow="Sizing Guide"
          title="Oversized but controlled"
          text="AURA.STREET fits relaxed. Size down for a cleaner silhouette or take your standard size for the intended drape."
        />
        
        <section className="px-6 md:px-12 max-w-5xl mx-auto pb-28 space-y-8">
          
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-neutral-900 border border-neutral-800 rounded-xl p-4 gap-4">
            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
              {(["Tops", "Outerwear", "Pants", "Footwear"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCalculatedSize(null);
                    setUserMeasurement("");
                  }}
                  className={`px-3 py-1.5 rounded text-[9px] uppercase tracking-widest font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? "bg-brand-sky/20 text-brand-sky border border-brand-sky/30"
                      : "bg-black border border-neutral-800 text-neutral-500 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[8px] uppercase tracking-widest font-bold text-neutral-500 mr-1">Unit</span>
              {(["CM", "IN"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`px-2.5 py-1 rounded text-[9px] uppercase tracking-widest font-bold cursor-pointer ${
                    unit === u
                      ? "bg-white text-black font-extrabold"
                      : "bg-black border border-neutral-800 text-neutral-500 hover:text-white"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="glass-panel-glow rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-black/60 text-[9px] uppercase tracking-[0.2em] text-neutral-500 border-b border-neutral-800">
                <tr>
                  <th className="p-5 font-bold">Size Tag</th>
                  {sizeCharts[activeCategory].headers.map((header) => (
                    <th key={header} className="p-5 font-bold">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(sizeCharts[activeCategory].data).map(([size, vals]) => (
                  <tr key={size} className="border-b border-neutral-900 last:border-0 hover:bg-white/[0.01] transition-colors">
                    <td className="p-5 text-white font-extrabold font-mono">{size}</td>
                    {vals.map((val, idx) => (
                      <td key={idx} className="p-5 text-neutral-300 font-mono">
                        {formatVal(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Smart Fit calculator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="glass-panel-glow rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Ruler className="w-4 h-4 text-brand-sky" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white">Size Recommendation</h3>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 leading-relaxed">
                  Enter your chest measurement (or waist for pants) in cm to receive a customized model recommendation.
                </p>
                <div className="mt-4 flex gap-2">
                  <input
                    type="number"
                    placeholder="E.G. 102 (CM)"
                    value={userMeasurement}
                    onChange={(e) => setUserMeasurement(e.target.value ? Number(e.target.value) : "")}
                    className="bg-black border border-neutral-800 rounded-lg py-2 px-3 text-[10px] uppercase tracking-widest focus:outline-none focus:border-brand-sky text-white placeholder:text-neutral-700 w-36"
                  />
                  <button
                    onClick={handleRecommend}
                    className="px-4 py-2 bg-white text-black hover:bg-brand-sky transition-colors rounded-lg text-[9px] uppercase tracking-widest font-extrabold cursor-pointer"
                  >
                    Calculate
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {calculatedSize && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-6 p-4 bg-brand-sky/10 border border-brand-sky/20 rounded-lg flex items-center justify-between"
                  >
                    <span className="text-[9px] uppercase tracking-widest font-bold text-brand-sky">Calculated fit</span>
                    <span className="text-sm font-extrabold text-white font-mono">{calculatedSize}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="glass-panel-glow rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-brand-sky" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Fitting Philosophy</h3>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed uppercase tracking-wider">
                AURA.STREET garment blocks feature dropped shoulders, generous chest volumes, and architectural drape. 
                If you prefer a contemporary oversized street drape, buy your standard size. For a tailored, closer silhouette, size down.
              </p>
            </div>
          </div>

        </section>
      </div>
    </PageShell>
  );
}
