"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Plus, Heart } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { useCurrency } from "@/lib/currency";
import { useCart } from "@/lib/cartContext";
import { useWishlist } from "@/lib/wishlistContext";

export default function StoreProductCard({ product }: { product: Product }) {
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const rawPrice = Number(product.price.replace(/[^0-9.]/g, ""));
  const isSaved = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      numericPrice: product.numericPrice || rawPrice,
      category: product.category,
      image: product.image,
      quantity: 1,
    });
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
        <div className="aspect-[3/4] w-full bg-neutral-950 rounded-lg overflow-hidden relative mb-6 glass-panel-glow">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00d2ff] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20" />
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-220"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 z-20 rounded-full border border-[#00d2ff]/30 bg-black/80 backdrop-blur-md px-3 py-1 text-[8px] uppercase tracking-[0.2em] font-mono font-bold text-[#00d2ff]">
              {product.badge}
            </span>
          )}

          {/* Heart Wishlist Trigger */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`absolute top-4 right-4 z-20 p-2 rounded-full border backdrop-blur-md transition-all cursor-pointer ${
              isSaved
                ? "bg-red-500/20 border-red-500/50 text-red-400"
                : "bg-black/60 border-white/10 text-neutral-400 hover:text-white hover:border-white/30"
            }`}
            title={isSaved ? "Saved to wishlist" : "Save to wishlist"}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
          </button>

          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-220 flex flex-col items-center justify-center gap-3 z-10 p-4">
            <span className="w-full py-3 bg-white text-black text-[9px] uppercase tracking-[0.2em] font-mono font-bold rounded hover:bg-[#00d2ff] transition-colors flex items-center justify-center gap-2">
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </span>
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-3 bg-black/80 border border-[#00d2ff]/40 text-[#00d2ff] text-[9px] uppercase tracking-[0.2em] font-mono font-bold rounded hover:bg-[#00d2ff] hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.2)]"
            >
              <Plus className="w-3.5 h-3.5" />
              Add to Bag
            </button>
          </div>
        </div>
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-1 text-white group-hover:text-[#00d2ff] transition-colors font-display">
              {product.name}
            </h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-mono">{product.material}</p>
          </div>
          <span className="text-sm text-[#00d2ff] font-mono font-bold whitespace-nowrap">{formatPrice(rawPrice)}</span>
        </div>
        <div className="mt-2 text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-mono">
          {product.colorways} Colorways // {product.stock} In Stock
        </div>
      </Link>
    </article>
  );
}
