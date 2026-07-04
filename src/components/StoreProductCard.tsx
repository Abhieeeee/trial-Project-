import Image from "next/image";
import Link from "next/link";
import { Eye, Plus } from "lucide-react";

import type { Product } from "@/lib/catalog";

export default function StoreProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="aspect-[3/4] w-full bg-neutral-950 rounded-lg overflow-hidden relative mb-6 glass-panel-glow">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-sky scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20" />
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 z-20 rounded-full border border-brand-sky/30 bg-black/70 px-3 py-1 text-[8px] uppercase tracking-[0.2em] text-brand-sky">
              {product.badge}
            </span>
          )}
          <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 z-10">
            <span className="px-6 py-3 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold rounded hover:bg-brand-sky transition-colors min-w-[150px] flex items-center justify-center gap-2">
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </span>
            <span className="px-6 py-3 border border-white/20 text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded hover:border-brand-sky transition-colors min-w-[150px] flex items-center justify-center gap-2">
              <Plus className="w-3.5 h-3.5" />
              Add to Bag
            </span>
          </div>
        </div>
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-1">{product.name}</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">{product.material}</p>
          </div>
          <span className="text-sm text-brand-sky text-glow-sky font-medium whitespace-nowrap">{product.price}</span>
        </div>
        <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-neutral-600">
          {product.colorways} Colorways // {product.stock} In Stock
        </div>
      </Link>
    </article>
  );
}
