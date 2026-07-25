"use client";

import Link from "next/link";
import { ArrowLeft, Compass, Search, ShoppingBag } from "lucide-react";
import PageShell from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <div className="min-h-[70vh] flex items-center justify-center px-6 md:px-12 py-20 font-sans">
        <div className="max-w-xl w-full text-center space-y-8 glass-panel-glow rounded-3xl p-8 md:p-12 border border-white/15 bg-[#0a0a0e]/95 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00D2FF]/[0.05] rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[10px] uppercase tracking-[0.3em] text-[#00D2FF] font-mono font-bold">
              404 // ROUTE NOT FOUND
            </span>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-[0.1em] font-display text-white">
              LOST IN THE SHADOWS
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed font-mono">
              The requested garment specification or page route does not exist in our active collection index.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[10px] uppercase tracking-wider">
            <Link
              href="/"
              className="py-3.5 px-4 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/10 text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>Go Home</span>
            </Link>

            <Link
              href="/shop"
              className="py-3.5 px-4 rounded-xl bg-[#00D2FF] text-black font-extrabold flex items-center justify-center gap-2 hover:bg-cyan-400 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,210,255,0.3)]"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-black" />
              <span>New Arrivals</span>
            </Link>

            <Link
              href="/shop"
              className="py-3.5 px-4 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/10 text-neutral-300 hover:text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Search className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>Search Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
