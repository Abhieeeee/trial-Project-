"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrency, CurrencyCode } from "@/lib/currency";
import { useCart } from "@/lib/cartContext";
import { useWishlist } from "@/lib/wishlistContext";
import RoleSwitcher from "@/components/RoleSwitcher";

const navLinks = [
  { label: "Collections", href: "/collections" },
  { label: "Shop", href: "/shop" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Editorial", href: "/editorial" },
  { label: "Archive", href: "/archive" },
];

export default function Header() {
  const pathname = usePathname();
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
        className="fixed top-0 left-0 w-full z-40 transition-all duration-300 py-4"
        style={{
          backgroundColor: isScrolled ? "rgba(5, 5, 5, 0.9)" : "transparent",
          backdropFilter: isScrolled ? "blur(24px)" : "none",
          borderBottom: isScrolled ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Top-Left Localization Currency Selector */}
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-400 relative">
            <div className="relative">
              <button 
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-full bg-white/[0.03] border border-white/10 hover:border-white/25 hover:text-white active:scale-95 transition-all cursor-pointer font-mono text-[10px]"
                data-magnetic
                title="Select store currency"
                aria-label="Select store currency"
              >
                <Globe className="w-3.5 h-3.5 text-[#00D2FF]" />
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
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-0 mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden py-2 z-[70] backdrop-blur-2xl shadow-2xl font-mono text-[10px]"
                    >
                      <div className="px-3 py-1 text-[8px] text-neutral-500 uppercase tracking-widest border-b border-white/5 mb-1 font-bold">
                        Select Currency
                      </div>
                      {(Object.keys(currencies) as CurrencyCode[]).map((code) => (
                        <button
                          key={code}
                          onClick={() => {
                            setCurrency(code);
                            setCurrencyMenuOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 hover:bg-white/5 transition-colors tracking-wider flex items-center justify-between cursor-pointer ${
                            currency === code ? "text-[#00D2FF] font-bold bg-[#00D2FF]/5" : "text-neutral-300"
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
            <span className="hidden sm:inline text-neutral-400 font-mono text-[9px] tracking-widest">Global Store</span>
          </div>
 
          {/* Wordmark AURA.STREET */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center"
          >
            <Link
              href="/"
              className="text-base md:text-lg font-bold tracking-[0.35em] uppercase font-display select-none hover:text-[#00D2FF] active:scale-95 transition-all duration-200 text-white"
            >
              AURA<span className="text-[#00D2FF]">.</span>STREET
            </Link>
          </motion.div>
 
          {/* Dynamic Nav Links */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center gap-8 py-1.5 px-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative text-[10px] uppercase tracking-[0.25em] font-medium transition-colors duration-200 group py-1 ${
                      isActive ? "text-[#00D2FF] font-bold" : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#00D2FF] transition-transform duration-200 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`} />
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Action Icons with 44px Minimum Touch Hit Areas */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link 
              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-300 hover:text-white active:scale-95 transition-all cursor-pointer rounded-lg hover:bg-white/5" 
              aria-label="Search products" 
              href="/shop" 
              data-magnetic
            >
              <Search className="w-4 h-4" />
            </Link>

            <Link 
              className="hidden sm:flex p-3 min-w-[44px] min-h-[44px] items-center justify-center text-neutral-300 hover:text-white active:scale-95 transition-all cursor-pointer rounded-lg hover:bg-white/5" 
              aria-label="Account" 
              href="/account" 
              data-magnetic
            >
              <UserRound className="w-4 h-4" />
            </Link>

            {/* Wishlist Trigger Button */}
            <button
              type="button"
              onClick={openWishlist}
              className="p-3 min-w-[44px] min-h-[44px] text-neutral-300 hover:text-white active:scale-95 transition-all relative flex items-center justify-center gap-1 cursor-pointer font-mono rounded-lg hover:bg-white/5"
              aria-label="Saved wishlist"
              title="Saved Wishlist"
            >
              <Heart className={`w-4 h-4 ${totalWishlist > 0 ? "text-red-400 fill-red-400" : "text-neutral-300 hover:text-red-400"}`} />
              <span className="text-[10px] font-semibold text-neutral-300">({totalWishlist})</span>
            </button>

            {/* Shopping Bag Quick Cart Trigger */}
            <button
              type="button"
              onClick={openCart}
              className="p-3 min-w-[44px] min-h-[44px] text-neutral-300 hover:text-white active:scale-95 transition-all relative flex items-center justify-center gap-1.5 cursor-pointer font-mono rounded-lg hover:bg-white/5"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-[#00D2FF]" />
              {totalItems > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#00D2FF] rounded-full shadow-[0_0_6px_#00D2FF]" />
              )}
              <span className="hidden lg:inline text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-200">({totalItems})</span>
            </button>

            <button
              className="md:hidden p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-300 hover:text-white active:scale-95 transition-all cursor-pointer rounded-lg hover:bg-white/5"
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
