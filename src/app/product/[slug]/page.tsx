"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Heart, PackageCheck, Ruler, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import PageShell from "@/components/PageShell";
import StoreProductCard from "@/components/StoreProductCard";
import ProductReviews from "@/components/ProductReviews";
import { products as fallbackProducts, type Product } from "@/lib/catalog";
import { useCurrency } from "@/lib/currency";
import { useCart } from "@/lib/cartContext";
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
  const rawPrice = Number(product.price.replace(/[^0-9.]/g, ""));

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "M");

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
                <Link href="/sizing" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#00D2FF] hover:text-white transition-colors">
                  <Ruler className="w-3.5 h-3.5" />
                  Size Guide
                </Link>
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
                onClick={() =>
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    numericPrice: product.numericPrice || rawPrice,
                    category: product.category,
                    image: product.image,
                    quantity: 1,
                  })
                }
                className="h-14 rounded bg-[#00d2ff] text-black hover:bg-cyan-400 font-bold transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.25em] cursor-pointer shadow-[0_0_20px_rgba(0,210,255,0.2)] font-mono"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Bag ({formatPrice(rawPrice)})
              </button>
              <button className="h-14 rounded border border-neutral-800 px-5 text-neutral-300 hover:border-brand-sky hover:text-white transition-colors cursor-pointer" aria-label="Add to wishlist">
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
    </PageShell>
  );
}
