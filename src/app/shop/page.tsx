"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { RotateCcw, Search, ShieldCheck, SlidersHorizontal, Truck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import StoreProductCard from "@/components/StoreProductCard";
import { categories, products } from "@/lib/catalog";

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

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
          <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed tracking-wide mb-12">
            Filter premium hoodies, jackets, pants, sneakers, and accessories. Product detail pages, cart, checkout, sizing,
            shipping, returns, and account flows are wired across the full storefront.
          </p>

          <div className="glass-panel-glow rounded-xl p-4 mb-10 grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <label className="relative block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="SEARCH PRODUCT, MATERIAL, CATEGORY"
                className="w-full bg-black border border-neutral-800 rounded-lg py-3 pl-11 pr-4 text-[10px] uppercase tracking-[0.2em] focus:outline-none focus:border-brand-sky transition-colors text-white placeholder:text-neutral-700"
              />
            </label>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="bg-black border border-neutral-800 rounded-lg py-3 px-4 text-[10px] uppercase tracking-[0.2em] text-neutral-400 focus:outline-none focus:border-brand-sky"
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="low">Price low to high</option>
              <option value="high">Price high to low</option>
              <option value="stock">Low stock first</option>
            </select>
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
