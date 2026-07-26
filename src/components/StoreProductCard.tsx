"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Plus, Heart, Check } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { useCurrency } from "@/lib/currency";
import { useCart } from "@/lib/cartContext";
import { useWishlist } from "@/lib/wishlistContext";

export default function StoreProductCard({ product }: { product: Product }) {
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const rawPrice = Number(product.price.replace(/[^0-9.]/g, ""));
  const isSaved = isInWishlist(product.id);

  const availableSizes = product.sizes || ["S", "M", "L", "XL"];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `${product.id}-${selectedSize}`,
      name: `${product.name} (${selectedSize})`,
      price: product.price,
      numericPrice: product.numericPrice || rawPrice,
      category: product.category,
      image: product.image,
      quantity: 1,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      numericPrice: product.numericPrice || rawPrice,
      category: product.category,
      image: product.image,
      slug: product.slug,
    });
  };

  return (
    <article className="group relative font-sans">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="aspect-[3/4] w-full bg-[#0a0a0e] rounded-2xl overflow-hidden relative mb-4 border border-white/10 group-hover:border-[#00D2FF]/40 transition-all duration-500 shadow-xl group-hover:shadow-[0_20px_40px_rgba(0,210,255,0.15)]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3.5 left-3.5 z-20 rounded-full border border-[#00D2FF]/30 bg-black/80 backdrop-blur-md px-3 py-1 text-[9px] uppercase tracking-widest font-mono font-bold text-[#00D2FF] shadow-md">
              {product.badge}
            </span>
          )}

          {/* Heart Wishlist Trigger */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            className={`absolute top-3.5 right-3.5 z-20 p-2.5 rounded-full backdrop-blur-md active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00D2FF] ${
              isSaved
                ? "bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                : "bg-black/60 text-neutral-300 hover:text-white hover:bg-black/90 border border-white/10"
            }`}
            title={isSaved ? "Saved to wishlist" : "Save to wishlist"}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
          </button>

          {/* Action overlay (persistent on mobile, hover-triggered on desktop) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 flex flex-col justify-end p-3.5 sm:p-4 gap-2.5 z-10 backdrop-blur-[2px]">
            {/* Quick Size Pills */}
            <div 
              className="flex items-center justify-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10 backdrop-blur-md mb-1"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-2.5 py-1 text-[9px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    selectedSize === sz
                      ? "bg-[#00D2FF] text-black shadow-[0_0_10px_rgba(0,210,255,0.4)]"
                      : "text-neutral-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <span className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[10px] uppercase tracking-[0.2em] font-mono font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md">
              <Eye className="w-3.5 h-3.5 text-[#00D2FF]" />
              Quick View
            </span>

            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to shopping bag`}
              className={`w-full py-2.5 text-[10px] uppercase tracking-[0.2em] font-mono font-extrabold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00D2FF] ${
                justAdded
                  ? "bg-emerald-500 text-black border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                  : "bg-white text-black hover:bg-[#00D2FF] hover:text-black shadow-lg"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Added ({selectedSize})
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Add Bag ({selectedSize})
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-start gap-3 px-1">
          <div>
            <h3 className="text-sm font-bold tracking-wide mb-1 text-white group-hover:text-[#00D2FF] transition-colors font-display">
              {product.name}
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono font-medium">{product.material}</p>
          </div>
          <span className="text-sm text-white font-mono font-extrabold whitespace-nowrap bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
            {formatPrice(rawPrice)}
          </span>
        </div>
        <div className="mt-2 text-[9px] uppercase tracking-widest text-neutral-400 font-mono font-semibold px-1 flex items-center justify-between">
          <span>{product.colorways} Colorways</span>
          <span className="text-emerald-400 font-bold">{product.stock} In Stock</span>
        </div>
      </Link>
    </article>
  );
}

