"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black border-t border-neutral-950 relative z-10 px-6 md:px-12 pt-28 pb-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 pb-20 border-b border-neutral-950">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <h3 className="text-xl font-bold tracking-[0.3em] uppercase font-display text-white">
              AURA<span className="text-brand-sky">.</span>STREET
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm tracking-wide leading-relaxed">
              Subscribe to drop notifications, editorial releases, and private collections access.
            </p>

            {/* Premium Newsletter Input */}
            <form onSubmit={handleSubscribe} className="relative max-w-sm flex items-center">
              <input
                type="email"
                placeholder="ENTER EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-4.5 bg-neutral-950/40 border border-neutral-900 focus:border-brand-sky rounded px-5 text-[10px] tracking-[0.2em] font-semibold text-white placeholder-neutral-700 outline-none transition-colors duration-300"
                required
                data-hover
              />
              <button
                type="submit"
                className="absolute right-3 p-2 text-neutral-500 hover:text-brand-sky transition-colors cursor-pointer"
                data-magnetic
                aria-label="Subscribe"
              >
                <ArrowUpRight className="w-5 h-5" />
              </button>
              
              {subscribed && (
                <span className="absolute -bottom-6 left-0 text-[9px] uppercase tracking-[0.2em] text-brand-sky text-glow-sky font-semibold">
                  Access Granted // Subscribed
                </span>
              )}
            </form>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
            
            {/* Catalog */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">
                Catalog
              </h4>
              <ul className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-500">
                {["New Arrivals", "All Products", "Fleece", "Accessories"].map((item) => (
                  <li key={item}>
                    <a href="#shop" className="hover:text-white transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">
                Information
              </h4>
              <ul className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-500">
                {["Sizing Guide", "Shipping & Duty", "Returns Policy", "Sustainability"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socials */}
            <div className="flex flex-col gap-6 col-span-2 sm:col-span-1">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">
                Socials
              </h4>
              <ul className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-500">
                {["Instagram", "TikTok", "Discord", "Pinterest"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5 group">
                    <a href="#" className="hover:text-white transition-colors duration-300">
                      {item}
                    </a>
                    <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all duration-300" />
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-[9px] uppercase tracking-[0.2em] text-neutral-600 font-semibold">
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-2">
            <span>© {new Date().getFullYear()} AURA STREET LTD.</span>
            <a href="#" className="hover:text-neutral-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-neutral-400 transition-colors">
              Terms of Use
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors cursor-pointer border border-neutral-900 hover:border-brand-sky/20 px-4 py-2 rounded"
            data-magnetic
          >
            <span>Back to Top</span>
            <span className="text-brand-sky text-glow-sky">↑</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
