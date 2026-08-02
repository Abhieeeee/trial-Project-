"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Plus, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { useCurrency } from "@/lib/currency";

interface StickyAddBarProps {
  productId: string;
  productName: string;
  price: string;
  numericPrice: number;
  category: string;
  image: string;
  selectedSize: string;
  onSizeChange: (size: string) => void;
  availableSizes: string[];
}

export default function StickyAddBar({
  productId,
  productName,
  price,
  numericPrice,
  category,
  image,
  selectedSize,
  onSizeChange,
  availableSizes,
}: StickyAddBarProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [isVisible, setIsVisible] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when scrolled past 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    addItem({
      id: `${productId}-${selectedSize}`,
      name: `${productName} (${selectedSize})`,
      price,
      numericPrice,
      category,
      image,
      quantity: 1,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-4 font-mono select-none"
        >
          <div className="max-w-4xl mx-auto glass-panel-glow p-3 sm:p-4 rounded-2xl border border-white/15 bg-[#0a0a0e]/95 backdrop-blur-2xl shadow-2xl flex items-center justify-between gap-4">
            
            {/* Left Thumbnail & Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-14 bg-neutral-900 rounded-lg border border-white/10 overflow-hidden shrink-0">
                <Image src={image} alt={productName} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-xs uppercase truncate max-w-[140px] sm:max-w-xs font-display">
                  {productName}
                </h4>
                <p className="text-[10px] text-[#00D2FF] font-bold">
                  {formatPrice(numericPrice)}
                </p>
              </div>
            </div>

            {/* Middle Size Picker (Desktop) */}
            <div className="hidden sm:flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10">
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onSizeChange(sz)}
                  className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all cursor-pointer ${
                    selectedSize === sz
                      ? "bg-[#00D2FF] text-black shadow-[0_0_10px_rgba(0,210,255,0.4)]"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Right Action Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`px-5 py-3 rounded-xl font-mono text-[10px] uppercase font-extrabold tracking-wider flex items-center gap-2 active:scale-95 transition-all cursor-pointer shrink-0 shadow-lg ${
                justAdded
                  ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                  : "bg-[#00D2FF] hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,210,255,0.3)]"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Added ({selectedSize})</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag ({selectedSize})</span>
                </>
              )}
            </button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
