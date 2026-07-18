"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Terminal, ArrowRight, Compass, Shield, X, Sparkles, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const navigationItems = [
    { label: "Storefront Home", path: "/", icon: Compass, category: "Navigation" },
    { label: "Shop All Catalog", path: "/shop", icon: ShoppingBag, category: "Navigation" },
    { label: "The Collections", path: "/collections", icon: Compass, category: "Navigation" },
    { label: "Design Editorial", path: "/editorial", icon: Compass, category: "Navigation" },
    { label: "Operations Dashboard", path: "/admin/dashboard", icon: Terminal, category: "Admin" },
    { label: "Orders Management", path: "/admin/orders", icon: Terminal, category: "Admin" },
    { label: "Inventory Stock Control", path: "/admin/inventory", icon: Terminal, category: "Admin" },
    { label: "Super Admin Control Center", path: "/super-admin/dashboard", icon: Shield, category: "Elevated" },
    { label: "Corporate Finance / Sales", path: "/super-admin/sales", icon: Shield, category: "Elevated" },
  ];

  const filteredItems = navigationItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleNavigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* HUD Trigger Tip */}
      <div className="fixed bottom-6 left-6 z-40 hidden md:block">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-neutral-900 rounded-lg text-[9px] uppercase tracking-[0.2em] font-mono text-neutral-500 hover:text-white hover:border-brand-sky/30 transition-all duration-300"
        >
          <Terminal className="w-3 h-3 text-neutral-600" />
          <span>CMD+K Console</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Dialog Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl bg-[#090909]/90 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl z-10 font-mono"
            >
              {/* Search input header */}
              <div className="flex items-center gap-3 px-4 border-b border-neutral-800">
                <Search className="w-4 h-4 text-neutral-500 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or route shortcut..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent text-white text-xs py-4 focus:outline-none placeholder:text-neutral-600 uppercase tracking-wider"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-neutral-800 rounded text-neutral-500 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Suggestions grid list */}
              <div className="max-h-[320px] overflow-y-auto p-2 scrollbar-thin">
                {filteredItems.length === 0 ? (
                  <div className="px-4 py-8 text-center text-neutral-600 text-[10px] uppercase tracking-wider">
                    No operations shortcuts matching query.
                  </div>
                ) : (
                  <div>
                    {/* Navigation Items Group */}
                    <div className="px-3 py-1.5 text-[8px] uppercase tracking-[0.25em] font-extrabold text-neutral-600">
                      System Shortcuts
                    </div>
                    <div className="space-y-1">
                      {filteredItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.label}
                            onClick={() => handleNavigate(item.path)}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left group"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-3.5 h-3.5 text-neutral-500 group-hover:text-brand-sky transition-colors" />
                              <span className="text-[10px] uppercase tracking-wider text-neutral-300 group-hover:text-white transition-colors">
                                {item.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[7px] bg-neutral-900 border border-neutral-800 rounded px-1.5 py-0.5 text-neutral-500 uppercase tracking-widest">
                                {item.category}
                              </span>
                              <ArrowRight className="w-3 h-3 text-neutral-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom footer bar */}
              <div className="px-4 py-3 border-t border-neutral-800 bg-[#060606] flex justify-between items-center text-[8px] uppercase tracking-[0.2em] font-extrabold text-neutral-500 select-none">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-2.5 h-2.5 text-brand-sky text-glow-sky animate-pulse" />
                  <span>Aura Street Command Core v1.2</span>
                </div>
                <div className="flex gap-2">
                  <span>ESC to exit</span>
                  <span>•</span>
                  <span>↵ to execute</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
