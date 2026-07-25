"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/lib/wishlistContext";
import { useCart } from "@/lib/cartContext";
import { useCurrency } from "@/lib/currency";

export function WishlistDrawer() {
  const { items, isOpen, closeWishlist, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  // Close wishlist drawer on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeWishlist();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeWishlist]);

  const handleMoveToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      numericPrice: item.numericPrice,
      category: item.category,
      image: item.image,
      quantity: 1,
    });
    removeItem(item.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWishlist}
            aria-hidden="true"
            className="fixed inset-0 z-[9990] bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wishlist-drawer-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed top-0 right-0 z-[9995] w-full sm:w-[440px] h-full bg-[#080808] border-l border-white/10 shadow-2xl flex flex-col justify-between font-sans overflow-hidden"
          >
            {/* Header Bar */}
            <div className="p-4 sm:p-6 border-b border-white/10 bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-red-500/20 rounded-lg bg-red-500/10 text-red-400">
                  <Heart className="w-4 h-4 fill-red-400" />
                </div>
                <div>
                  <h2 id="wishlist-drawer-title" className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
                    Wishlist ({items.length})
                  </h2>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-300">
                    AURA STREET SAVED ITEMS
                  </p>
                </div>
              </div>

              <button
                onClick={closeWishlist}
                aria-label="Close wishlist"
                className="p-2.5 min-w-[44px] min-h-[44px] text-neutral-300 hover:text-white active:scale-95 transition-all cursor-pointer rounded-lg hover:bg-white/5 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3.5 font-mono text-[11px] scrollbar-thin scrollbar-thumb-neutral-800">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <Heart className="w-12 h-12 text-neutral-700" />
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-bold">
                    YOUR WISHLIST IS EMPTY
                  </p>
                  <p className="text-[9px] text-neutral-500 uppercase tracking-widest max-w-xs">
                    Click the heart icon on any garment to save it for later.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeWishlist}
                    className="mt-4 px-6 py-3 bg-white text-black font-bold uppercase tracking-[0.2em] text-[9px] rounded-lg hover:bg-[#00D2FF] transition-colors"
                  >
                    Explore Catalog
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/15 transition-colors flex gap-4 items-center relative group"
                  >
                    <div className="relative w-16 h-20 bg-neutral-900 rounded-lg border border-white/10 overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-bold text-white uppercase truncate text-xs">
                        {item.name}
                      </h4>
                      <p className="text-[9px] text-neutral-400 uppercase tracking-wider">
                        {item.category}
                      </p>
                      <p className="text-[#00D2FF] font-bold text-xs">
                        {formatPrice(item.numericPrice)}
                      </p>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => handleMoveToCart(item)}
                          className="px-3 py-1.5 bg-[#00D2FF] hover:bg-cyan-400 text-black text-[9px] uppercase tracking-wider font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <ShoppingBag className="w-3 h-3" /> Move to Bag
                        </button>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Bar */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#050505]">
                <Link
                  href="/shop"
                  onClick={closeWishlist}
                  className="w-full py-3.5 text-center bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-widest text-[9px] rounded-lg flex items-center justify-center gap-2 font-mono transition-colors"
                >
                  Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
