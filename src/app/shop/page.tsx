"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { RotateCcw, Search, ShieldCheck, SlidersHorizontal, Truck, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import StoreProductCard from "@/components/StoreProductCard";
import { categories, products } from "@/lib/catalog";

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const sortLabels: Record<string, string> = {
    featured: "Featured",
    low: "Price low to high",
    high: "Price high to low",
    stock: "Low stock first",
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => activeCategory === "All" || product.category === activeCategory)
      .filter((product) => {
        const haystack = `${product.name} ${product.category} ${product.material} ${product.description}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
      .sort((a, b) => {
        if (sort === "low") return a.numericPrice - b.numericPrice;
        if (sort === "high") return b.numericPrice - a.numericPrice;
        if (sort === "stock") return a.stock - b.stock;
        return 0;
      });
  }, [activeCategory, query, sort]);

  return (
    <main className="relative min-h-screen bg-black text-white w-full overflow-hidden pt-36 lg:pt-44">
      <CustomCursor />
      <Header />

      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-8 font-mono">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Shop</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-[0.18em] font-display text-white mb-10">
            SHOP ALL
          </h1>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed tracking-widest mb-12">
            FILTER PREMIUM HOODIES, JACKETS, PANTS, SNEAKERS, AND ACCESSORIES. EACH PIECE INCORPORATES OUR SIGNATURE FASHION GEOMETRY AND CYBER-LUXURY COMPOSITION.
          </p>

          <div className="glass-panel-glow rounded-xl p-4 mb-10 grid gap-4 lg:grid-cols-[1fr_auto_auto] items-center">
            {/* Search Input Underline-Trace Accent */}
            <label className="relative block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="SEARCH SPECIFICATIONS"
                className="w-full bg-black border border-neutral-800 rounded-lg py-3.5 pl-12 pr-4 text-[10px] uppercase tracking-[0.2em] focus:outline-none focus:border-brand-sky focus:shadow-[0_0_12px_rgba(125,211,252,0.15)] transition-all text-white placeholder:text-neutral-700 font-mono"
              />
            </label>

            {/* Custom Interactive Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full lg:w-56 bg-black border border-neutral-800 rounded-lg py-3.5 px-4 text-[10px] uppercase tracking-[0.2em] text-neutral-400 focus:outline-none focus:border-brand-sky focus:text-white transition-all flex items-center justify-between cursor-pointer"
                aria-label="Sort products dropdown"
              >
                <span>SORT: {sortLabels[sort]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-full mt-2 bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden z-20 shadow-2xl"
                  >
                    {Object.entries(sortLabels).map(([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSort(key);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left py-3 px-4 text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-900 transition-colors cursor-pointer ${
                          sort === key ? "text-brand-sky font-bold bg-brand-sky/5" : "text-neutral-400"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 px-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-sky" />
              {filteredProducts.length} Items
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold border transition-all duration-300 ${
                  activeCategory === cat
                    ? "border-brand-sky bg-brand-sky/10 text-white shadow-[0_0_15px_rgba(125,211,252,0.15)]"
                    : "border-neutral-800 text-neutral-400 hover:border-brand-sky hover:text-white"
                }`}
                data-magnetic
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              >
                <StoreProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Truck, title: "Global Shipping", desc: "Free worldwide shipping on all orders over EUR 200." },
            { icon: RotateCcw, title: "Complimentary Returns", desc: "30-day return requests with guided return labels." },
            { icon: ShieldCheck, title: "Secure Checkout", desc: "A checkout-ready frontend with wallet and card payment states." },
          ].map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="flex flex-col items-center text-center p-8 glass-panel border border-white/5 rounded-xl"
            >
              <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mb-6">
                <feature.icon className="w-5 h-5 text-brand-sky" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-3">{feature.title}</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed max-w-[220px]">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
