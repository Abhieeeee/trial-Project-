"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";
import { useCurrency } from "@/lib/currency";
import { useCart } from "@/lib/cartContext";

export default function CartPage() {
  const { formatPrice } = useCurrency();
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto py-12">
        <PageIntro
          eyebrow="Cart"
          title="Your current bag"
          text="Review quantities, apply promo codes, and continue into a themed multi-step checkout."
        />
        <section className="px-6 md:px-12 max-w-7xl mx-auto pb-28 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          
          {/* Cart List */}
          <div className="space-y-5">
            <AnimatePresence mode="popLayout">
              {items.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel-glow rounded-xl p-12 text-center flex flex-col items-center gap-6"
                >
                  <ShoppingBag className="w-12 h-12 text-neutral-600 animate-pulse" />
                  <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">Your bag is empty.</p>
                  <Link href="/shop" className="px-8 py-3 bg-[#00d2ff] text-black font-mono font-bold hover:bg-cyan-400 transition-colors text-[10px] uppercase tracking-[0.2em] rounded-lg">
                    Browse Shop Catalog
                  </Link>
                </motion.div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-panel-glow rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative w-20 h-24 rounded-lg bg-neutral-900 overflow-hidden border border-white/10 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white font-sans mb-1">{item.name}</h3>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-mono mb-2">{item.category}</p>
                        <span className="text-xs text-[#00d2ff] font-mono font-bold">{formatPrice(item.numericPrice)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8 pt-3 sm:pt-0 border-t sm:border-0 border-neutral-900 font-mono">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-white/15 bg-black/60 rounded-xl overflow-hidden font-mono">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-white font-bold">{formatPrice(item.numericPrice * item.quantity)}</p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-400 hover:text-red-400 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors cursor-pointer"
                        aria-label={`Remove ${item.name} from bag`}
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Right Summary */}
          {items.length > 0 && (
            <aside className="glass-panel-glow rounded-2xl p-6 sm:p-8 h-fit lg:sticky lg:top-28 font-mono space-y-6">
              <h2 className="text-sm font-display font-bold uppercase tracking-[0.2em] text-white border-b border-white/10 pb-4">
                Summary
              </h2>

              {/* Free Shipping Progress Meter */}
              <div className="space-y-2 p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
                  <span className="text-[#00D2FF]">Free Shipping Progress</span>
                  <span className="text-white">{subtotal >= 200 ? "100%" : `${Math.round(Math.min((subtotal / 200) * 100, 100))}%`}</span>
                </div>
                <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-[#00D2FF] transition-all duration-500 shadow-[0_0_8px_#00D2FF]"
                    style={{ width: `${Math.min((subtotal / 200) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3 text-xs uppercase tracking-[0.18em] text-neutral-300">
                <div className="flex justify-between"><span>Subtotal</span><span className="text-white font-bold">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="text-[#00D2FF] font-bold">{subtotal >= 200 ? "EXPRESS FREE" : "Calculated at checkout"}</span></div>
                <div className="border-t border-white/10 pt-4 flex justify-between text-base text-white font-extrabold">
                  <span>Total</span>
                  <span className="text-[#00D2FF]">{formatPrice(subtotal)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-8 w-full py-4 rounded-xl bg-[#00D2FF] text-black hover:bg-cyan-400 font-extrabold transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(0,210,255,0.4)] active:scale-95"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </aside>
          )}

        </section>
      </div>
    </PageShell>
  );
}
