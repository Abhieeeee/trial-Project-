"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Heart, PackageCheck, Ruler, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import PageShell from "@/components/PageShell";
import StoreProductCard from "@/components/StoreProductCard";
import { products } from "@/lib/catalog";
import { useCurrency } from "@/lib/currency";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const { formatPrice } = useCurrency();
  const rawPrice = Number(product.price.replace(/[^0-9.]/g, ""));

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const related = products.filter((item) => item.slug !== product.slug).slice(0, 4);

  const imagesList = [product.image, "/hero-editorial.png", "/editorial-spread.png"];

  return (
    <PageShell>
      <section className="px-6 md:px-12 max-w-7xl mx-auto pt-[140px] md:pt-[180px] pb-24">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-8 font-mono">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Lookbook Media Column */}
          <div className="grid gap-5">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden glass-panel-glow">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image src={activeImage} alt={product.name} fill priority className="object-cover" />
                </motion.div>
              </AnimatePresence>
              {product.badge && (
                <span className="absolute top-5 left-5 rounded-full border border-brand-sky/30 bg-black/70 px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] text-brand-sky shadow-[0_0_10px_rgba(125,211,252,0.15)] font-mono">
                  {product.badge}
                </span>
              )}
            </div>
            
            {/* Clickable Lookbook Thumbnails */}
            <div className="grid grid-cols-3 gap-4">
              {imagesList.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                    activeImage === img ? "border-brand-sky scale-98 shadow-[0_0_12px_rgba(125,211,252,0.2)]" : "border-neutral-900 hover:border-neutral-700 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View lookbook thumbnail ${idx + 1}`}
                >
                  <Image src={img} alt={`${product.name} lookbook view ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Selection details */}
          <div className="lg:sticky lg:top-28">
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-sky text-glow-sky font-bold mb-5 font-mono">
              {product.category} · {product.id}
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-[0.08em] font-display text-white">
              {product.name}
            </h1>
            <div className="mt-5 flex items-center gap-4">
              <span className="text-2xl font-display font-bold text-brand-sky text-glow-sky">{formatPrice(rawPrice)}</span>
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-mono">
                <Star className="w-3.5 h-3.5 fill-brand-sky text-brand-sky" />
                4.9 // 128 Reviews
              </span>
            </div>
            <p className="mt-8 text-sm md:text-base text-neutral-400 leading-relaxed tracking-wide">
              {product.description}
            </p>

            {/* Sizing options with trace animations */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-3 font-mono">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-400">Select Size</span>
                <Link href="/sizing" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-brand-sky hover:text-white transition-colors">
                  <Ruler className="w-3.5 h-3.5" />
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 min-w-12 rounded border text-xs font-bold transition-all duration-300 cursor-pointer ${
                      selectedSize === size
                        ? "border-brand-sky bg-brand-sky/10 text-white shadow-[0_0_12px_rgba(125,211,252,0.15)]"
                        : "border-neutral-800 text-neutral-400 hover:border-brand-sky hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Actions */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              <Link href="/cart" className="h-14 rounded bg-white text-black hover:bg-brand-sky hover:text-white transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.25em] font-extrabold" data-magnetic>
                <ShoppingBag className="w-4 h-4" />
                Add to Bag
              </Link>
              <button className="h-14 rounded border border-neutral-800 px-5 text-neutral-300 hover:border-brand-sky hover:text-white transition-colors cursor-pointer" aria-label="Add to wishlist" data-magnetic>
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Metadata Rows */}
            <div className="mt-10 grid gap-3 font-mono">
              {[
                { icon: Truck, title: "Free shipping over EUR 200" },
                { icon: ShieldCheck, title: "Secure payment states ready" },
                { icon: PackageCheck, title: `${product.stock} units available` },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 rounded-lg border border-neutral-900 bg-neutral-950/60 p-4">
                  <item.icon className="w-4 h-4 text-brand-sky" />
                  <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">{item.title}</span>
                </div>
              ))}
            </div>

            {/* Specifications lists */}
            <div className="mt-10 border-t border-neutral-900 pt-8">
              <h2 className="text-xs uppercase tracking-[0.25em] font-bold mb-5 font-mono text-neutral-300">Product Details</h2>
              <ul className="grid gap-3 text-sm text-neutral-400">
                {product.details.map((detail) => (
                  <li key={detail} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-sky shadow-[0_0_8px_#7dd3fc]" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Suggested Fits */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-32">
        <div className="flex items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-sky text-glow-sky mb-3 font-semibold font-mono">
              Related System
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.12em] font-display">
              Complete The Fit
            </h2>
          </div>
          <Link href="/shop" className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-brand-sky transition-colors font-mono">
            Shop all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {related.map((item) => (
            <StoreProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
