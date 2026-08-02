"use client";

import { use, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Heart, PackageCheck, Ruler, ShieldCheck, ShoppingBag, Star, Truck, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Product360Rotator from "@/components/Product360Rotator";
import StickyAddBar from "@/components/StickyAddBar";
import PageShell from "@/components/PageShell";
import StoreProductCard from "@/components/StoreProductCard";
import ProductReviews from "@/components/ProductReviews";
import { products as fallbackProducts, type Product } from "@/lib/catalog";
import { useCurrency } from "@/lib/currency";
import { useCart } from "@/lib/cartContext";
import { useWishlist } from "@/lib/wishlistContext";
import { createClient } from "@/lib/supabase/client";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const fallbackMatch = fallbackProducts.find((item) => item.slug === slug);
  const [product, setProduct] = useState<Product | null>(fallbackMatch || fallbackProducts[0] || null);

  useEffect(() => {
    async function loadProductDetail() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true);

        if (data && data.length > 0) {
          const matched = data.find(
            (p) => p.name.toLowerCase().replace(/\s+/g, "-") === slug
          );
          if (matched) {
            setProduct({
              id: matched.id,
              name: matched.name,
              price: `€${matched.price}.00`,
              numericPrice: Number(matched.price),
              category: matched.category as any,
              stock: matched.stock,
              colorways: matched.colorways || 1,
              material: matched.material || "Technical Fabric",
              slug: matched.name.toLowerCase().replace(/\s+/g, "-"),
              image: matched.images && matched.images[0] ? matched.images[0] : "/moto-jacket.png",
              description: matched.description || "",
              badge: matched.stock < 15 ? "LOW STOCK" : undefined,
              details: [matched.material, `${matched.stock} units available`],
              sizes: ["S", "M", "L", "XL"],
            });
          }
        }
      } catch (err) {
        console.error("Product detail fetch error:", err);
      }
    }
    loadProductDetail();
  }, [slug]);

  if (!product) {
    notFound();
  }

  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const rawPrice = Number(product.price.replace(/[^0-9.]/g, ""));
  const isWishlistSaved = isInWishlist(product.id);

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "M");
  const [activeColor, setActiveColor] = useState("Obsidian Cyan");
  const [addedToast, setAddedToast] = useState(false);

  // AI Fit Calculator state
  const [showFitCalculator, setShowFitCalculator] = useState(false);
  const [userHeight, setUserHeight] = useState(175);
  const [userWeight, setUserWeight] = useState(70);

  const calculatedFitSize = useMemo(() => {
    if (userHeight > 182 || userWeight > 85) return "XL";
    if (userHeight > 175 || userWeight > 73) return "L";
    if (userHeight > 165 || userWeight > 60) return "M";
    return "S";
  }, [userHeight, userWeight]);

  const related = fallbackProducts.filter((item) => item.slug !== product.slug).slice(0, 4);

  const imagesList = [product.image, "/hero-editorial.png", "/editorial-spread.png"];

  return (
    <PageShell>
      <section className="px-6 md:px-12 max-w-7xl mx-auto pt-4 md:pt-8 pb-24">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-neutral-300 mb-8 font-mono">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#00D2FF] font-bold">{product.name}</span>
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
                <span className="absolute top-5 left-5 rounded-full border border-[#00D2FF]/30 bg-black/70 px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#00D2FF] shadow-[0_0_10px_rgba(0,210,255,0.15)] font-mono font-bold">
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
                    activeImage === img ? "border-[#00D2FF] scale-98 shadow-[0_0_12px_rgba(0,210,255,0.2)]" : "border-white/10 hover:border-white/30 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View lookbook thumbnail ${idx + 1}`}
                >
                  <Image src={img} alt={`${product.name} lookbook view ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* 3D 360° Colorway Rotator Canvas */}
            <Product360Rotator
              productName={product.name}
              activeColor={activeColor}
              onColorChange={(color) => setActiveColor(color)}
            />
          </div>

          {/* Right Selection details */}
          <div className="lg:sticky lg:top-28">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#00D2FF] text-glow-sky font-bold mb-5 font-mono">
              {product.category} · {product.id}
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-[0.08em] font-display text-white">
              {product.name}
            </h1>
            <div className="mt-5 flex items-center gap-4">
              <span className="text-2xl font-display font-bold text-[#00D2FF] text-glow-sky">{formatPrice(rawPrice)}</span>
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono">
                <Star className="w-3.5 h-3.5 fill-[#00D2FF] text-[#00D2FF]" />
                4.9 // 128 Reviews
              </span>
            </div>
            <p className="mt-8 text-sm md:text-base text-neutral-300 leading-relaxed tracking-wide font-mono">
              {product.description}
            </p>

            {/* Accessible Sizing radiogroup */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-3 font-mono">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-300">Select Size</span>
                <button 
                  type="button"
                  onClick={() => setShowFitCalculator(true)}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#00D2FF] hover:text-white transition-colors cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  AI Fit Calculator
                </button>
              </div>
              <div role="radiogroup" aria-label="Select Garment Size" className="flex flex-wrap gap-3">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => setSelectedSize(size)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                          const idx = product.sizes.indexOf(size);
                          const next = product.sizes[(idx + 1) % product.sizes.length];
                          setSelectedSize(next);
                        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                          const idx = product.sizes.indexOf(size);
                          const prev = product.sizes[(idx - 1 + product.sizes.length) % product.sizes.length];
                          setSelectedSize(prev);
                        }
                      }}
                      className={`h-12 min-w-12 px-4 rounded-xl border text-xs font-bold font-mono transition-all duration-300 cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-[#00D2FF] ${
                        isSelected
                          ? "border-[#00D2FF] bg-[#00D2FF]/15 text-white shadow-[0_0_15px_rgba(0,210,255,0.25)] ring-1 ring-[#00D2FF]"
                          : "border-white/10 text-neutral-300 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to Cart Actions */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              <button
                type="button"
                onClick={() => {
                  addItem({
                    id: `${product.id}-${selectedSize}`,
                    name: `${product.name} (${selectedSize})`,
                    price: product.price,
                    numericPrice: product.numericPrice || rawPrice,
                    category: product.category,
                    image: product.image,
                    quantity: 1,
                  });
                  setAddedToast(true);
                  setTimeout(() => setAddedToast(false), 2000);
                }}
                className={`h-14 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.25em] cursor-pointer font-mono active:scale-95 ${
                  addedToast
                    ? "bg-emerald-500 text-black border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    : "bg-[#00d2ff] text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.2)]"
                }`}
              >
                {addedToast ? (
                  <>
                    <PackageCheck className="w-4 h-4" />
                    Added ({selectedSize})
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Bag ({formatPrice(rawPrice)})
                  </>
                )}
              </button>
              <button 
                type="button"
                onClick={() =>
                  toggleWishlist({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    numericPrice: product.numericPrice || rawPrice,
                    category: product.category,
                    image: product.image,
                    slug: product.slug,
                  })
                }
                className={`h-14 rounded-xl border px-5 transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
                  isWishlistSaved
                    ? "border-red-500/40 bg-red-500/20 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                    : "border-white/10 bg-white/[0.03] text-neutral-300 hover:border-[#00D2FF]/50 hover:text-white"
                }`} 
                aria-label="Add to wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlistSaved ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>

            {/* Metadata Rows */}
            <div className="mt-10 grid gap-3 font-mono">
              {[
                { icon: Truck, title: "Complimentary Global Express Shipping" },
                { icon: ShieldCheck, title: "Authenticity Guaranteed // 450GSM Cotton" },
                { icon: PackageCheck, title: `${product.stock} Units Remaining in Limited Allocation` },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <item.icon className="w-4 h-4 text-[#00D2FF]" />
                  <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-300 font-medium">{item.title}</span>
                </div>
              ))}
            </div>

            {/* Specifications Technical Breakdown */}
            <div className="mt-10 border-t border-white/10 pt-8">
              <h2 className="text-xs uppercase tracking-[0.25em] font-bold mb-5 font-mono text-neutral-200">
                Technical Specifications & Engineering
              </h2>
              <ul className="grid gap-3 text-xs text-neutral-300 font-mono">
                {product.details.concat([
                  "450GSM Heavyweight French Terry Cotton",
                  "Double-Needle Coverstitched Seams",
                  "Preshrunk Organic Garment Finish",
                ]).map((detail, idx) => (
                  <li key={`${detail}-${idx}`} className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] shadow-[0_0_8px_#00D2FF]" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Customer Reviews & Ratings Section */}
        <ProductReviews productName={product.name} />
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

      {/* AI Sizing Fit Recommendation Calculator Modal */}
      <AnimatePresence>
        {showFitCalculator && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFitCalculator(false)}
              className="fixed inset-0 z-[9990] bg-black/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9995] w-full max-w-md bg-[#0a0a0e] border border-white/15 p-6 rounded-2xl shadow-2xl backdrop-blur-2xl font-mono"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2 text-[#00D2FF]">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white">AI Fit Recommendation</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFitCalculator(false)}
                  className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase tracking-widest mb-1 font-bold">
                    Height: {userHeight} cm
                  </label>
                  <input
                    type="range"
                    min="150"
                    max="205"
                    value={userHeight}
                    onChange={(e) => setUserHeight(Number(e.target.value))}
                    className="w-full accent-[#00D2FF] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase tracking-widest mb-1 font-bold">
                    Weight: {userWeight} kg
                  </label>
                  <input
                    type="range"
                    min="45"
                    max="120"
                    value={userWeight}
                    onChange={(e) => setUserWeight(Number(e.target.value))}
                    className="w-full accent-[#00D2FF] cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-center space-y-2 mt-6">
                  <span className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Recommended Cut</span>
                  <span className="block text-2xl font-extrabold text-[#00D2FF] font-display">{calculatedFitSize} (Oversized Cut)</span>
                  <p className="text-[9px] text-neutral-300">
                    Engineered for standard street drape. Select {calculatedFitSize} for classic 450GSM boxy fit.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedSize(calculatedFitSize);
                    setShowFitCalculator(false);
                  }}
                  className="w-full py-3 bg-[#00D2FF] text-black font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-cyan-400 transition-all active:scale-95 cursor-pointer mt-4"
                >
                  Apply {calculatedFitSize} to Selection
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sticky Floating Glass Add to Bag Bottom Bar on Scroll */}
      <StickyAddBar
        productId={product.id}
        productName={product.name}
        price={product.price}
        numericPrice={rawPrice}
        category={product.category}
        image={product.image}
        selectedSize={selectedSize}
        onSizeChange={(size) => setSelectedSize(size)}
        availableSizes={product.sizes}
      />
    </PageShell>
  );
}
