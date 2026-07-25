"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black border-t border-white/5 relative z-10 px-6 md:px-12 pt-24 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 pb-16 border-b border-white/5">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h3 className="text-xl font-bold tracking-[0.35em] uppercase font-display text-white">
              AURA<span className="text-[#00D2FF]">.</span>STREET
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm tracking-wide leading-relaxed">
              Subscribe to drop notifications, editorial releases, and private collections access.
            </p>

            <form onSubmit={handleSubscribe} className="relative max-w-sm flex items-center">
              <input
                type="email"
                placeholder="ENTER EMAIL ADDRESS"
                aria-label="Enter email address for drop notifications"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full py-3.5 bg-black border border-white/10 focus:border-[#00D2FF] rounded-lg px-4 text-[10px] tracking-[0.2em] font-mono font-medium text-white placeholder-neutral-500 outline-none transition-colors duration-300"
                required
                data-hover
              />
              <button
                type="submit"
                className="absolute right-2 p-2 text-neutral-300 hover:text-white active:scale-95 transition-all cursor-pointer"
                data-magnetic
                aria-label="Subscribe"
              >
                <ArrowUpRight className="w-4 h-4 text-[#00D2FF]" />
              </button>
              {subscribed && (
                <span className="absolute -bottom-6 left-0 text-[9px] uppercase tracking-[0.2em] text-[#00D2FF] font-mono font-semibold">
                  Access Granted // Subscribed
                </span>
              )}
            </form>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <FooterColumn
              title="Catalog"
              links={[
                ["New Arrivals", "/shop"],
                ["All Products", "/shop"],
                ["Collections", "/collections"],
                ["Lookbook", "/lookbook"],
              ]}
            />
            <FooterColumn
              title="Information"
              links={[
                ["Sizing Guide", "/sizing"],
                ["Shipping & Duty", "/shipping"],
                ["Returns Policy", "/returns"],
                ["FAQ", "/faq"],
              ]}
            />
            <div className="flex flex-col gap-6 col-span-2 sm:col-span-1">
              <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-white">Socials</h4>
              <ul className="flex flex-col gap-3.5 text-[10px] uppercase tracking-[0.2em] font-mono text-neutral-300">
                {["Instagram", "TikTok", "Discord", "Pinterest"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5 group">
                    <a href="#" className="hover:text-white transition-colors duration-300">{item}</a>
                    <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all duration-300" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-mono">
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-2">
            <span>© {new Date().getFullYear()} AURA STREET LTD.</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Back to top of page"
            className="flex items-center gap-2 text-neutral-300 hover:text-white active:scale-95 transition-all cursor-pointer border border-white/10 hover:border-white/30 px-4 py-2 rounded-lg"
            data-magnetic
          >
            <span>Back to Top</span>
            <span className="text-[#00D2FF]">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">{title}</h4>
      <ul className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-300">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="hover:text-white transition-colors duration-300">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
