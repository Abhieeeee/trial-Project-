"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const products = [
  { id: 1, name: 'Essential Hoodie', price: '€245', category: 'Hoodies', image: '/moto-jacket.png', material: '450GSM Heavy Fleece', colorways: 3 },
  { id: 2, name: 'Shadow Hoodie II', price: '€265', category: 'Hoodies', image: '/hero-editorial.png', material: '480GSM French Terry', colorways: 2 },
  { id: 3, name: 'Moto Jacket', price: '€680', category: 'Jackets', image: '/moto-jacket.png', material: 'Premium Calf Leather', colorways: 1 },
  { id: 4, name: 'Tech Shell Jacket', price: '€520', category: 'Jackets', image: '/collections-banner.png', material: 'Gore-Tex Pro', colorways: 2 },
  { id: 5, name: 'Tech Cargo Pants', price: '€320', category: 'Pants', image: '/tech-cargos.png', material: 'Ripstop Nylon', colorways: 3 },
  { id: 6, name: 'Tailored Jogger', price: '€195', category: 'Pants', image: '/editorial-spread.png', material: 'Ponte Roma Knit', colorways: 4 },
  { id: 7, name: 'Street Runner', price: '€410', category: 'Sneakers', image: '/street-sneaker.png', material: 'Full-Grain Leather', colorways: 5 },
  { id: 8, name: 'Aura Beanie', price: '€65', category: 'Accessories', image: '/hero-editorial.png', material: 'Merino Wool', colorways: 6 }
];

const categories = ["All", "Hoodies", "Jackets", "Pants", "Sneakers", "Accessories"];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <main className="relative min-h-screen bg-black text-white w-full overflow-hidden pt-32">
      <CustomCursor />
      <Header />

      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Shop</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold uppercase tracking-[0.1em] font-display text-white mb-12">
            SHOP ALL
          </h1>

          {/* Filters */}
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

        {/* Product Grid */}
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
                className="group relative"
              >
                <Link href="#" className="block">
                  <div className="aspect-[3/4] w-full bg-neutral-950 rounded-lg overflow-hidden relative mb-6 glass-panel-glow">
                    {/* Top hover line indicator */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-sky scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20" />
                    
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 z-10">
                      <button className="px-6 py-3 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold rounded hover:bg-brand-sky hover:text-black transition-colors min-w-[140px]" data-hover>
                        Quick View
                      </button>
                      <button className="px-6 py-3 border border-white/20 text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded hover:border-white transition-colors min-w-[140px]" data-hover>
                        Add to Bag
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-1">{product.name}</h3>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">{product.material}</p>
                    </div>
                    <span className="text-sm text-brand-sky text-glow-sky font-medium">{product.price}</span>
                  </div>
                  <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                    {product.colorways} Colorways
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Shipping & Returns */}
      <section className="py-24 px-6 md:px-12 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Global Shipping", desc: "Free worldwide shipping on all orders over €200." },
              { icon: RotateCcw, title: "Complimentary Returns", desc: "30-day returns with free scheduled home pickup." },
              { icon: ShieldCheck, title: "Secure Checkout", desc: "Bank-grade SSL encryption for absolute security." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
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
                <p className="text-[11px] text-neutral-400 leading-relaxed max-w-[200px]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
