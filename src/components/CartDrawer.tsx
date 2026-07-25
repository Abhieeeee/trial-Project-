"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck, Tag, Check, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { useCurrency } from "@/lib/currency";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totalItems,
    subtotal,
    freeShippingThreshold,
    appliedCode,
    discountPercent,
    applyDiscount,
    removeDiscount,
    discountAmount,
    finalTotal,
  } = useCart();

  const { formatPrice } = useCurrency();
  const [promoInput, setPromoInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<{ success: boolean; text: string } | null>(null);

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Close drawer on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const result = applyDiscount(promoInput);
    setPromoFeedback({ success: result.success, text: result.message });
    if (result.success) setPromoInput("");
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
            onClick={closeCart}
            aria-hidden="true"
            className="fixed inset-0 z-[9990] bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed top-0 right-0 z-[9995] w-full sm:w-[460px] h-full bg-[#080808] border-l border-white/10 shadow-2xl flex flex-col justify-between font-sans overflow-hidden"
          >
            {/* Header Bar */}
            <div className="p-4 sm:p-6 border-b border-white/10 bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-white/10 rounded-lg bg-white/[0.03] text-[#00D2FF]">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 id="cart-drawer-title" className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
                    Shopping Bag ({totalItems})
                  </h2>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-300">
                    AURA STREET EXPRESS CHECKOUT
                  </p>
                </div>
              </div>

              <button
                onClick={closeCart}
                aria-label="Close shopping bag"
                className="p-2.5 min-w-[44px] min-h-[44px] text-neutral-300 hover:text-white active:scale-95 transition-all cursor-pointer rounded-lg hover:bg-white/5 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="px-6 py-3.5 bg-white/[0.02] border-b border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
                <span className="flex items-center gap-2 text-neutral-300">
                  <Truck className="w-3.5 h-3.5 text-[#00D2FF]" />
                  {remainingForFreeShipping === 0
                    ? "Express Free Shipping Unlocked!"
                    : `Add ${formatPrice(remainingForFreeShipping)} more for Free Shipping`}
                </span>
                <span className="text-[#00D2FF] font-bold">{Math.round(shippingProgress)}%</span>
              </div>
              <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#00D2FF] to-cyan-400 transition-all duration-500"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3.5 font-mono text-[11px] scrollbar-thin scrollbar-thumb-neutral-800">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <ShoppingBag className="w-12 h-12 text-neutral-700" />
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-bold">
                    YOUR BAG IS EMPTY
                  </p>
                  <p className="text-[9px] text-neutral-500 uppercase tracking-widest max-w-xs">
                    Explore our latest technical outerwear and streetwear drops.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-4 px-6 py-3 bg-[#00D2FF] text-black font-bold uppercase tracking-[0.2em] text-[9px] rounded-lg hover:bg-cyan-400 transition-colors"
                  >
                    Browse Collections
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

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 pt-1">
                        <div className="inline-flex items-center rounded-lg border border-white/10 bg-black font-mono text-[9px] overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-2.5 py-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 py-1 font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-2.5 py-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary, Promo Code Box & Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#050505] space-y-4 font-mono">
                
                {/* Promo Code Form */}
                <div className="space-y-2">
                  {appliedCode ? (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-[9px] uppercase">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Tag className="w-3 h-3" /> Code '{appliedCode}' Active (-{discountPercent}%)
                      </span>
                      <button
                        onClick={removeDiscount}
                        className="text-neutral-400 hover:text-white text-[8px] underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="PROMO CODE (e.g. AURA10)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="flex-1 bg-black border border-white/10 rounded-lg p-2.5 text-[9px] uppercase text-white focus:outline-none focus:border-[#00D2FF]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-white/10 border border-white/10 rounded-lg text-white font-bold text-[9px] uppercase hover:bg-white hover:text-black transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {promoFeedback && !appliedCode && (
                    <p className={`text-[8px] uppercase tracking-wider ${
                      promoFeedback.success ? "text-emerald-400" : "text-amber-400"
                    }`}>
                      {promoFeedback.text}
                    </p>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-400 uppercase">
                    <span>Subtotal</span>
                    <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 uppercase font-bold">
                      <span>Promo Savings</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-400 uppercase">
                    <span>Shipping</span>
                    <span className="text-[#00D2FF]">
                      {remainingForFreeShipping === 0 ? "FREE" : "Calculated at checkout"}
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white uppercase">
                    <span>Total Payable</span>
                    <span className="text-[#00D2FF]">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-[9px] uppercase tracking-widest font-bold">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="py-3.5 text-center border border-white/10 rounded-lg hover:border-white/30 text-neutral-300 hover:text-white transition-colors"
                  >
                    View Bag
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="py-3.5 text-center bg-white hover:bg-[#00D2FF] text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    Checkout <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
