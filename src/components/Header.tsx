"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Heart, Menu, Search, ShoppingBag, UserRound, X, ChevronRight } from "lucide-react";
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
  const [announcementVisible, setAnnouncementVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setCurrencyMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-40 transition-all duration-300"
        style={{
          backgroundColor: isScrolled ? "rgba(3, 3, 5, 0.92)" : "transparent",
          backdropFilter: isScrolled ? "blur(28px) saturate(200%)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(28px) saturate(200%)" : "none",
          borderBottom: isScrolled
            ? "1px solid rgba(0, 210, 255, 0.15)"
            : "1px solid transparent",
          boxShadow: isScrolled
            ? "0 16px 50px -10px rgba(0, 0, 0, 0.95), inset 0 -1px 0 0 rgba(0, 210, 255, 0.12)"
            : "none",
        }}
      >
        {/* ── Announcement Bar ── */}
        <AnimatePresence>
          {announcementVisible && (
            <motion.div
              initial={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="announcement-bar w-full overflow-hidden border-b border-[#00D2FF]/10 bg-[#030305]"
            >
              <div className="relative flex items-center justify-center py-2 px-6">
                <div className="overflow-hidden w-full max-w-3xl">
                  <div className="flex whitespace-nowrap animate-ticker">
                    {[0, 1].map((i) => (
                      <span
                        key={i}
                        className="text-[9px] uppercase tracking-[0.28em] font-mono font-semibold text-neutral-300 flex items-center gap-6 mr-0"
                        aria-hidden={i > 0}
                      >
                        <span className="text-[#00D2FF]">✦</span>
                        Free shipping on orders over NPR 5,000 &nbsp;
                        <span className="text-[#00D2FF]">✦</span>
                        &nbsp;Drop 01 Now Live → &nbsp;
                        <span className="text-[#00D2FF]">✦</span>
                        &nbsp;450GSM Premium Streetwear &nbsp;
                        <span className="text-[#00D2FF]">✦</span>
                        &nbsp;Paris-Originated Designs &nbsp;
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setAnnouncementVisible(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-neutral-500 hover:text-white transition-colors rounded-md hover:bg-white/5 cursor-pointer"
                  aria-label="Dismiss announcement"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main Navigation Bar ── */}
        <div className="py-3.5">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* Currency Selector */}
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-400 relative">
            <div className="relative">
              <button
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-full bg-white/[0.04] border border-white/10 hover:border-[#00D2FF]/40 hover:text-white active:scale-95 transition-all cursor-pointer font-mono text-[10px]"
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
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-0 mt-2 w-52 bg-[#08080c] border border-white/10 rounded-2xl overflow-hidden py-2 z-[70] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] font-mono text-[10px]"
                    >
                      <div className="px-3 py-1.5 text-[8px] text-neutral-500 uppercase tracking-widest border-b border-white/5 mb-1 font-bold">
                        Select Currency
                      </div>
                      {(Object.keys(currencies) as CurrencyCode[]).map((code) => (
                        <button
                          key={code}
                          onClick={() => {
                            setCurrency(code);
                            setCurrencyMenuOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 hover:bg-white/[0.04] transition-colors tracking-wider flex items-center justify-between cursor-pointer ${
                            currency === code
                              ? "text-[#00D2FF] font-bold bg-[#00D2FF]/[0.06]"
                              : "text-neutral-300"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{currencies[code].flag}</span>
                            <span>{code} ({currencies[code].symbol})</span>
                          </span>
                          {currency === code && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]" />
                          )}
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

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center"
          >
            <Link
              href="/"
              className="text-base md:text-lg font-bold tracking-[0.38em] uppercase font-display select-none hover:text-[#00D2FF] active:scale-95 transition-all duration-200 text-white"
            >
              AURA<span className="text-[#00D2FF]">.</span>STREET
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center gap-8 py-1.5 px-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`nav-glow-link relative text-[10px] uppercase tracking-[0.25em] font-medium transition-colors duration-200 py-1 ${
                      isActive ? "text-[#00D2FF] font-bold" : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 hover:text-white active:scale-95 transition-all cursor-pointer rounded-xl hover:bg-white/[0.05]"
              aria-label="Search products"
              href="/shop"
              data-magnetic
            >
              <Search className="w-4 h-4" />
            </Link>

            <Link
              className="hidden sm:flex p-3 min-w-[44px] min-h-[44px] items-center justify-center text-neutral-400 hover:text-white active:scale-95 transition-all cursor-pointer rounded-xl hover:bg-white/[0.05]"
              aria-label="Account"
              href="/account"
              data-magnetic
            >
              <UserRound className="w-4 h-4" />
            </Link>

            {/* Wishlist */}
            <button
              type="button"
              onClick={openWishlist}
              className="p-3 min-w-[44px] min-h-[44px] text-neutral-400 hover:text-white active:scale-95 transition-all relative flex items-center justify-center gap-1 cursor-pointer font-mono rounded-xl hover:bg-white/[0.05]"
              aria-label="Saved wishlist"
              title="Saved Wishlist"
            >
              <Heart
                className={`w-4 h-4 ${
                  totalWishlist > 0 ? "text-red-400 fill-red-400" : "text-neutral-400 hover:text-red-400"
                }`}
              />
              {totalWishlist > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-[8px] font-bold text-white flex items-center justify-center font-mono leading-none">
                  {totalWishlist}
                </span>
              )}
            </button>

            {/* Cart Bag */}
            <button
              type="button"
              onClick={openCart}
              className="p-3 min-w-[44px] min-h-[44px] text-neutral-400 hover:text-white active:scale-95 transition-all relative flex items-center justify-center gap-1.5 cursor-pointer font-mono rounded-xl hover:bg-white/[0.05]"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-[#00D2FF]" />
              {totalItems > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#00D2FF] text-[8px] font-bold text-black flex items-center justify-center font-mono leading-none shadow-[0_0_8px_#00D2FF]">
                  {totalItems}
                </span>
              )}
              <span className="hidden lg:inline text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-300 ml-0.5">
                Bag
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 hover:text-white active:scale-95 transition-all cursor-pointer rounded-xl hover:bg-white/[0.05]"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

      {/* ── Mobile Full-Screen Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 bg-[#030305]/98 backdrop-blur-2xl flex flex-col justify-between p-8"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <span className="text-base font-bold tracking-[0.4em] uppercase font-display text-white">
                AURA<span className="text-[#00D2FF]">.</span>STREET
              </span>
              <button
                className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer rounded-xl hover:bg-white/5"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex flex-col gap-2 my-auto">
              {[...navLinks, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" }, { label: "Account", href: "/account" }].map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  key={link.href}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex items-center justify-between text-2xl font-bold uppercase tracking-[0.2em] font-display hover:text-[#00D2FF] transition-colors text-white py-3 px-4 min-h-[52px] rounded-2xl hover:bg-white/[0.03] active:scale-98"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:text-[#00D2FF] group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom Strip */}
            <div className="flex flex-col gap-4 text-xs tracking-wider text-neutral-500 border-t border-white/[0.06] pt-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-[0.25em] uppercase">
                  {currencies[currency]?.flag} {currency} // {currencies[currency]?.symbol}
                </span>
                <span className="text-[#00D2FF] font-mono text-[9px] tracking-[0.2em] uppercase">Drop 01 Live</span>
              </div>
              <p className="text-[9px] text-neutral-700 font-mono tracking-wider">
                © {new Date().getFullYear()} AURA STREET Ltd. All rights reserved.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
