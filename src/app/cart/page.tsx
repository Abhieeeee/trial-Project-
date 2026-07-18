"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";
import { products } from "@/lib/catalog";

export default function CartPage() {
  // Simulate active cart items using state so interaction works dynamically
  const [cart, setCart] = useState(() => {
    return products.slice(0, 2).map((p) => ({ ...p, quantity: 1 }));
  });

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: Math.max(1, nextQty) };
          }
          return item;
        })
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.numericPrice * item.quantity, 0);

  return (
    <PageShell>
      <PageIntro
        eyebrow="Cart"
        title="Your current bag"
        text="Review quantities, move items into wishlist, apply promo codes, and continue into a themed multi-step checkout."
      />
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-28 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        
        {/* Cart List */}
        <div className="space-y-5">
          {cart.length === 0 ? (
            <div className="glass-panel-glow rounded-xl p-12 text-center flex flex-col items-center gap-6">
              <ShoppingBag className="w-12 h-12 text-neutral-600" />
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">Your bag is empty.</p>
              <Link href="/shop" className="px-8 py-3 bg-white text-black hover:bg-brand-sky hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-extrabold">
                Shop all products
              </Link>
            </div>
          ) : (
            cart.map((product) => (
              <div key={product.id} className="glass-panel-glow rounded-xl p-4 grid grid-cols-[96px_1fr] md:grid-cols-[120px_1fr_auto] gap-5 items-center">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-950">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div>
                  <h2 className="text-sm uppercase tracking-[0.15em] font-bold">{product.name}</h2>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-2">{product.material} · Size M</p>
                  <div className="flex items-center gap-3 mt-5">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="w-11 h-11 rounded border border-neutral-800 flex items-center justify-center hover:border-brand-sky text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-5 text-center">{product.quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="w-11 h-11 rounded border border-neutral-800 flex items-center justify-center hover:border-brand-sky text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1 flex md:flex-col items-center md:items-end justify-between gap-4">
                  <span className="text-brand-sky font-display font-bold text-glow-sky">
                    EUR {product.numericPrice * product.quantity}
                  </span>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="w-11 h-11 flex items-center justify-center text-neutral-600 hover:text-red-400 border border-transparent hover:border-neutral-900 rounded-lg transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Summary panel */}
        {cart.length > 0 && (
          <aside className="glass-panel-glow rounded-xl p-6 h-fit lg:sticky lg:top-28">
            <h2 className="text-lg font-display font-bold uppercase tracking-[0.15em] mb-6">Order Summary</h2>
            <div className="space-y-4 text-xs uppercase tracking-[0.18em] text-neutral-400">
              <Row label="Subtotal" value={`EUR ${subtotal}`} />
              <Row label="Estimated Duty" value="Calculated at checkout" />
              <Row label="Shipping" value="EUR 0" />
              <div className="border-t border-neutral-900 pt-4">
                <Row label="Total" value={`EUR ${subtotal}`} strong />
              </div>
            </div>
            <Link
              href={`/checkout?amount=${subtotal}`}
              className="mt-8 h-14 rounded bg-white text-black hover:bg-brand-sky hover:text-white transition-all flex items-center justify-center text-[10px] uppercase tracking-[0.22em] font-extrabold"
              data-magnetic
            >
              Continue Checkout
            </Link>
          </aside>
        )}
      </section>
    </PageShell>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "text-white text-sm font-bold" : ""}`}>
      <span>{label}</span>
      <span className={strong ? "text-brand-sky text-glow-sky" : "text-neutral-300"}>{value}</span>
    </div>
  );
}
