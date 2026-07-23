"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useCurrency, CurrencyCode } from "@/lib/currency";
import { useCart } from "@/lib/cartContext";
import { useWishlist } from "@/lib/wishlistContext";

const navLinks = [
  { label: "Collections", href: "/collections" },
  { label: "Shop", href: "/shop" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Editorial", href: "/editorial" },
  { label: "Archive", href: "/archive" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currency, setCurrency, currencies } = useCurrency();
  const { openCart, totalItems } = useCart();
  const { openWishlist, totalWishlist } = useWishlist();
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className="fixed top-0 left-0 w-full z-40 transition-all duration-220 py-5"
        style={{
          backgroundColor: isScrolled ? "rgba(5, 5, 5, 0.85)" : "transparent",
          backdropFilter: isScrolled ? "blur(20px)" : "none",
          borderBottom: isScrolled ? "1px solid rgba(232, 228, 223, 0.05)" : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Top-Left Localization Currency Selector */}
          <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.25em] font-medium text-neutral-400 relative">
            <div className="relative">
              <button 
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-[#00D2FF] hover:text-white transition-all cursor-pointer font-mono"
                data-magnetic
                title="Select store currency"
              >
                <Globe className="w-3 h-3 text-[#00D2FF]" />
                <span>{currencies[currency]?.flag || "🌐"} {currencies[currency]?.symbol} {currency}</span>
              </button>

              <AnimatePresence>
                {currencyMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[60] cursor-default" 
                      onClick={() => setCurrencyMenuOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute left-0 mt-2 w-48 bg-neutral-950/95 border border-white/15 rounded-lg overflow-hidden py-2 z-[70] backdrop-blur-xl shadow-2xl font-mono text-[9px]"
                    >
                      <div className="px-3 py-1 text-[8px] text-neutral-500 uppercase tracking-widest border-b border-neutral-900 mb-1 font-bold">
                        Select Currency
                      </div>
                      {(Object.keys(currencies) as CurrencyCode[]).map((code) => (
                        <button
                          key={code}
                          onClick={() => {
                            setCurrency(code);
                            setCurrencyMenuOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 hover:bg-white/10 transition-colors tracking-wider flex items-center justify-between cursor-pointer ${
                            currency === code ? "text-[#00D2FF] font-bold bg-[#00D2FF]/10" : "text-neutral-300"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{currencies[code].flag}</span>
                            <span>{code} ({currencies[code].symbol})</span>
                          </span>
                          {currency === code && <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <span className="hidden sm:inline text-neutral-800">|</span>
            <span className="hidden sm:inline text-neutral-500 font-mono">Global Storefront</span>
          </div>
 
          {/* Wordmark AURA.STREET */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center"
          >
            <Link
              href="/"
              className="text-base md:text-lg font-bold tracking-[0.4em] uppercase font-display select-none hover:text-[#00D2FF] transition-colors duration-220 text-white"
            >
              AURA<span className="text-[#00D2FF]">.</span>STREET
            </Link>
          </motion.div>
 
          {/* Dynamic Laser Nav Links */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center gap-8 py-2 px-8 rounded-full border border-transparent">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-[9px] uppercase tracking-[0.3em] font-medium text-neutral-400 hover:text-white transition-colors duration-220 group py-1"
                >
                  {link.label}
                  {/* Glowing Laser Underline effect */}
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#00D2FF] scale-x-0 group-hover:scale-x-100 transition-transform duration-220 origin-left" />
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#00D2FF] blur-[4px] scale-x-0 group-hover:scale-x-100 transition-transform duration-220 origin-left opacity-60" />
                </Link>
              ))}
            </div>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer" aria-label="Search products" href="/shop" data-magnetic>
              <Search className="w-4 h-4" />
            </Link>
            <Link className="hidden sm:flex p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer" aria-label="Account" href="/account" data-magnetic>
              <UserRound className="w-4 h-4" />
            </Link>
            {/* Wishlist Trigger Button */}
            <button
              type="button"
              onClick={openWishlist}
              className="p-2 text-neutral-400 hover:text-white transition-colors relative flex items-center gap-1 cursor-pointer font-mono"
              aria-label="Saved wishlist"
              title="Saved Wishlist"
            >
              <Heart className={`w-4 h-4 ${totalWishlist > 0 ? "text-red-400 fill-red-400" : "text-neutral-400 hover:text-red-400"}`} />
              <span className="text-[9px] font-semibold text-neutral-400">({totalWishlist})</span>
            </button>

            {/* Shopping Bag Quick Cart Trigger */}
            <button
              type="button"
              onClick={openCart}
              className="p-2 text-neutral-400 hover:text-white transition-colors relative flex items-center gap-1.5 cursor-pointer font-mono"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-[#00D2FF]" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#00D2FF] rounded-full shadow-[0_0_8px_#00D2FF] animate-pulse" />
              )}
              <span className="hidden lg:inline text-[9px] uppercase tracking-[0.25em] font-semibold text-neutral-300">({totalItems})</span>
            </button>
            <button
              className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-[#050505]/98 flex flex-col justify-between p-8"
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-bold tracking-[0.4em] uppercase font-display text-white">
                AURA<span className="text-[#00D2FF]">.</span>STREET
              </span>
              <button className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-6 my-auto pl-4">
              {[...navLinks, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" }, { label: "Account", href: "/account" }].map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  key={link.href}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-bold uppercase tracking-[0.2em] font-display hover:text-[#00D2FF] transition-colors text-white block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col gap-4 text-xs tracking-wider text-neutral-500 border-t border-neutral-900 pt-6">
              <div className="flex justify-between">
                <span>EN // EUR</span>
                <span className="text-[#00D2FF]">Paris Edition</span>
              </div>
              <p className="text-[10px] text-neutral-600">
                © {new Date().getFullYear()} AURA STREET Ltd. All rights reserved.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
