"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import StoreProductCard from "@/components/StoreProductCard";
import { products as fallbackProducts, type Product } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/client";

export default function ProductGrid() {
  const [items, setItems] = useState<Product[]>(fallbackProducts.slice(0, 4));

  useEffect(() => {
    async function loadGridProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .limit(4);

        if (data && data.length > 0 && !error) {
          const mapped: Product[] = data.map((p) => ({
            id: p.id,
            name: p.name,
            price: `€${p.price}.00`,
            numericPrice: Number(p.price),
            category: String(p.category),
            stock: p.stock,
            colorways: p.colorways || 1,
            material: p.material || "Technical Fabric",
            slug: p.name.toLowerCase().replace(/\s+/g, "-"),
            image: p.images && p.images[0] ? p.images[0] : "/moto-jacket.png",
            description: p.description || "",
            badge: p.stock < 15 ? "LOW STOCK" : undefined,
            details: [p.material, `${p.stock} units available`],
            sizes: ["S", "M", "L", "XL"],
          }));
          setItems(mapped);
        }
      } catch (err) {
        console.error("Product grid fetch error:", err);
      }
    }
    loadGridProducts();
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.14 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 48 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section id="shop" className="py-32 bg-[#030305] relative z-10 px-6 md:px-12 font-sans border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            {/* Decorative line + label */}
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-[1px] bg-[#00D2FF]" />
              <p className="text-[9px] uppercase tracking-[0.32em] text-[#00D2FF] font-bold font-mono">
                Drop 01 // Collection Catalog
              </p>
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.08em] font-display text-white text-glow-white">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">Collection</span>
            </h2>
          </div>

          <div className="flex flex-col gap-3 max-w-xs">
            <p className="text-xs text-neutral-400 tracking-wide leading-relaxed font-mono">
              Constructed using heavy-cotton blends, waterproof tech fabrics, and luxury hardware. Tailored for modern silhouettes.
            </p>
            {/* Stat badges */}
            <div className="flex gap-3">
              {[
                { val: "450", unit: "GSM" },
                { val: "4", unit: "Colorways" },
                { val: "S–XL", unit: "Sizing" },
              ].map(({ val, unit }) => (
                <div key={unit} className="glass-panel px-3 py-2 rounded-xl border border-white/10 text-center">
                  <span className="block text-white font-black text-sm font-display">{val}</span>
                  <span className="block text-neutral-500 text-[9px] uppercase tracking-[0.2em] font-mono">{unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editorial Bento Grid Product Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {items.map((product, index) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              className={`tilt-card-wrap ${index === 0 ? "sm:col-span-2 lg:col-span-2" : ""}`}
            >
              <div className="tilt-card-inner h-full">
                {/* NEW DROP ribbon on first item */}
                {index === 0 && (
                  <div className="relative h-full">
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D2FF] text-black text-[8px] uppercase tracking-[0.25em] font-black font-mono shadow-[0_0_15px_rgba(0,210,255,0.6)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                      Featured Drop 01
                    </div>
                    <StoreProductCard product={product} />
                  </div>
                )}
                {index !== 0 && <StoreProductCard product={product} />}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Explore All CTA */}
        <div className="mt-20 text-center">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl border border-white/[0.12] text-[10px] uppercase tracking-[0.28em] font-bold text-neutral-300 hover:text-white hover:border-[#00D2FF]/40 hover:bg-[#00D2FF]/[0.04] transition-all duration-300 font-mono backdrop-blur-sm shadow-md"
          >
            <span>Explore All Garments</span>
            <ArrowUpRight className="w-4 h-4 text-[#00D2FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
