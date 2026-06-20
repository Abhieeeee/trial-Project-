"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Search, Globe } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          isScrolled ? "py-4" : "py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* 1. Left Section - Globe & Language (Desktop only) */}
          <div className="hidden lg:flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-400">
            <button className="flex items-center gap-2 hover:text-white transition-colors" data-magnetic>
              <Globe className="w-3.5 h-3.5" />
              <span>EN // EUR</span>
            </button>
            <span className="text-neutral-700">|</span>
            <span className="text-brand-sky text-glow-sky">Paris Edition</span>
          </div>

          {/* 2. Brand Identity Logo (Center or Left depending on viewport) */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex items-center"
          >
            <Link
              href="/"
              className="text-lg md:text-xl font-bold tracking-[0.35em] uppercase font-display select-none hover:text-brand-sky transition-colors duration-300"
            >
              AURA<span className="text-brand-sky">.</span>STREET
            </Link>
          </motion.div>

          {/* 3. Center Navigation Links (Desktop only, wrapped in glassmorphic capsule on scroll) */}
          <nav className="hidden md:flex items-center gap-1">
            <div
              className={`flex items-center gap-8 px-6 py-2.5 rounded-full transition-all duration-500 ${
                isScrolled ? "glass-panel-glow border-neutral-900 px-8" : "border border-transparent"
              }`}
            >
              {["Collections", "Shop", "Editorial", "Archive"].map((link) => (
                <Link
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className="relative text-[10px] uppercase tracking-[0.25em] font-medium text-neutral-400 hover:text-white transition-colors duration-300 group py-1"
                >
                  {link}
                  {/* Subtle animated underline */}
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-sky scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </Link>
              ))}
            </div>
          </nav>

          {/* 4. Right Section - Icons */}
          <div className="flex items-center gap-3 md:gap-6">
            <button
              className="p-2 text-neutral-400 hover:text-white transition-colors"
              aria-label="Search"
              data-magnetic
            >
              <Search className="w-4 h-4 md:w-4.5 md:h-4.5" />
            </button>
            
            <button
              className="p-2 text-neutral-400 hover:text-white transition-colors relative flex items-center gap-2"
              aria-label="Shopping bag"
              data-magnetic
            >
              <ShoppingBag className="w-4 h-4 md:w-4.5 md:h-4.5" />
              <span className="absolute -top-0.5 -right-0.5 md:top-1 md:right-1 w-1.5 h-1.5 bg-brand-sky rounded-full text-glow-sky" />
              <span className="hidden lg:inline text-[9px] uppercase tracking-[0.2em] font-semibold text-neutral-400">
                (0)
              </span>
            </button>

            <button
              className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 5. Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-black/98 flex flex-col justify-between p-8"
          >
            {/* Header section in menu */}
            <div className="flex items-center justify-between">
              <span className="text-base font-bold tracking-[0.3em] uppercase font-display">
                AURA<span className="text-brand-sky">.</span>STREET
              </span>
              <button
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Links List */}
            <div className="flex flex-col gap-6 my-auto pl-4">
              {["Collections", "Shop", "Editorial", "Archive"].map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  key={link}
                >
                  <Link
                    href={`/${link.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl font-bold uppercase tracking-[0.15em] font-display hover:text-brand-sky transition-colors text-white block"
                  >
                    {link}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer section in menu */}
            <div className="flex flex-col gap-4 text-xs tracking-wider text-neutral-500 border-t border-neutral-900 pt-6">
              <div className="flex justify-between">
                <span>EN // EUR</span>
                <span className="text-brand-sky">Paris Edition</span>
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
