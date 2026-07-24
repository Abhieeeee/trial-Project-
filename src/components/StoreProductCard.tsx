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
        <div className="aspect-[3/4] w-full bg-neutral-950 rounded-xl overflow-hidden relative mb-4 border border-white/5 group-hover:border-white/20 transition-all duration-300">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 z-20 rounded-full border border-white/10 bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-mono font-medium text-white">
              {product.badge}
            </span>
          )}

          {/* Heart Wishlist Trigger */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00D2FF] ${
              isSaved
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-black/50 text-neutral-400 hover:text-white hover:bg-black/80"
            }`}
            title={isSaved ? "Saved to wishlist" : "Save to wishlist"}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
          </button>

          {/* Hover action overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 gap-2 z-10">
            <span className="w-full py-2.5 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-mono font-bold rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shadow-lg">
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </span>
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to shopping bag`}
              className="w-full py-2.5 bg-black/80 border border-white/20 text-white text-[10px] uppercase tracking-[0.2em] font-mono font-bold rounded-lg hover:bg-white hover:text-black hover:border-white transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md focus-visible:ring-2 focus-visible:ring-[#00D2FF]"
            >
              <Plus className="w-3.5 h-3.5" />
              Add to Bag
            </button>
          </div>
        </div>

        <div className="flex justify-between items-start gap-3">
          <div>
            <h3 className="text-sm font-semibold tracking-wide mb-1 text-white group-hover:text-[#00D2FF] transition-colors font-display">
              {product.name}
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">{product.material}</p>
          </div>
          <span className="text-sm text-white font-mono font-bold whitespace-nowrap">{formatPrice(rawPrice)}</span>
        </div>
        <div className="mt-1.5 text-[9px] uppercase tracking-widest text-neutral-500 font-mono">
          {product.colorways} Colorways • {product.stock} In Stock
        </div>
      </Link>
    </article>
  );
}
