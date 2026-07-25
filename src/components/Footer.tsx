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
    <footer className="bg-[#030305] border-t border-white/10 relative z-10 px-6 md:px-12 pt-24 pb-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 pb-16 border-b border-white/10">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h3 className="text-2xl font-black tracking-[0.35em] uppercase font-display text-white text-glow-white">
              AURA<span className="text-[#00D2FF]">.</span>STREET
            </h3>
            <p className="text-xs text-neutral-300 max-w-sm tracking-wider leading-relaxed font-mono">
              Subscribe to drop notifications, editorial releases, and private collections access.
            </p>

            <form onSubmit={handleSubscribe} className="relative max-w-sm flex items-center">
              <input
                type="email"
                placeholder="ENTER EMAIL ADDRESS"
                aria-label="Enter email address for drop notifications"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full py-4 bg-white/[0.03] border border-white/15 focus:border-[#00D2FF] rounded-xl px-4 text-[10px] tracking-[0.2em] font-mono font-medium text-white placeholder:text-neutral-500 outline-none transition-all duration-300 focus:bg-white/[0.06] shadow-inner"
                required
                data-hover
              />
              <button
                type="submit"
                className="absolute right-2 p-2.5 text-neutral-300 hover:text-white active:scale-95 transition-all cursor-pointer bg-white/10 hover:bg-[#00D2FF] hover:text-black rounded-lg"
                data-magnetic
                aria-label="Subscribe"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
              {subscribed && (
                <span className="absolute -bottom-6 left-0 text-[9px] uppercase tracking-[0.2em] text-[#00D2FF] font-mono font-bold">
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
            <div className="flex flex-col gap-6 col-span-2 sm:col-span-1 font-mono">
              <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-white">Socials</h4>
              <ul className="flex flex-col gap-3.5 text-[10px] uppercase tracking-[0.2em] text-neutral-300">
                {["Instagram", "TikTok", "Discord", "Pinterest"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5 group">
                    <a href="#" className="hover:text-[#00D2FF] transition-colors duration-300">{item}</a>
                    <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 group-hover:text-[#00D2FF] transition-all duration-300" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-[9px] uppercase tracking-[0.2em] text-neutral-300 font-mono">
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-2">
            <span>© {new Date().getFullYear()} AURA STREET LTD.</span>
            <Link href="/privacy" className="hover:text-[#00D2FF] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#00D2FF] transition-colors">Terms of Use</Link>
            <Link href="/contact" className="hover:text-[#00D2FF] transition-colors">Contact</Link>
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Back to top of page"
            className="flex items-center gap-2.5 text-neutral-200 hover:text-white active:scale-95 transition-all cursor-pointer border border-white/15 bg-white/[0.03] hover:border-[#00D2FF]/50 px-5 py-2.5 rounded-xl backdrop-blur-md font-bold shadow-lg"
            data-magnetic
          >
            <span>Back to Top</span>
            <span className="text-[#00D2FF] font-black">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="flex flex-col gap-6 font-mono">
      <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">{title}</h4>
      <ul className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-300">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="hover:text-[#00D2FF] transition-colors duration-300">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
