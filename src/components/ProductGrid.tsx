"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

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
            category: p.category as any,
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
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section id="shop" className="py-28 bg-black relative z-10 px-6 md:px-12 font-sans border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#00D2FF] mb-3 font-semibold font-mono">
              Drop 01 // Collection Catalog
            </p>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wider font-display text-white">
              The Collection
            </h2>
          </div>
          <p className="text-xs text-neutral-400 max-w-sm tracking-wide leading-relaxed font-sans">
            Constructed using heavy-cotton blends, waterproof tech fabrics, and luxury hardware. Tailored for modern silhouettes.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {items.map((product) => (
            <motion.div key={product.id} variants={cardVariants}>
              <StoreProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="inline-flex px-8 py-3.5 rounded-lg border border-white/10 text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-300 hover:text-white hover:border-white/30 hover:bg-white/[0.03] transition-all duration-300 font-mono"
          >
            Explore All Garments
          </Link>
        </div>
      </div>
    </section>
  );
}
