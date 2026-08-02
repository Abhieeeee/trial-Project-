"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Social Platform SVG Icons
function IconInstagram() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z" />
    </svg>
  );
}

function IconDiscord() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.055a19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
    </svg>
  );
}

function IconPinterest() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
  );
}

const socials = [
  { label: "Instagram", icon: IconInstagram, href: "#" },
  { label: "TikTok", icon: IconTikTok, href: "#" },
  { label: "Discord", icon: IconDiscord, href: "#" },
  { label: "Pinterest", icon: IconPinterest, href: "#" },
];

import { useToast } from "@/components/Toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { success } = useToast();

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (email) {
      setSubscribed(true);
      success("VIP Access Confirmed", `Subscribed '${email}' to AURA STREET Drop Alerts.`);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#030305] border-t border-white/[0.05] relative z-10 font-sans">

      {/* Material Spec Top Band */}
      <div className="w-full border-b border-white/[0.05] overflow-hidden">
        <div className="flex whitespace-nowrap animate-ticker py-3">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="text-[8px] uppercase tracking-[0.32em] font-mono font-bold text-neutral-600 flex items-center gap-8 mr-0"
              aria-hidden={i > 0}
            >
              <span className="text-[#00D2FF]/40">◆</span>
              450GSM MATTE COTTON &nbsp;
              <span className="text-[#00D2FF]/40">◆</span>
              &nbsp;ENZYME WASHED FINISH &nbsp;
              <span className="text-[#00D2FF]/40">◆</span>
              &nbsp;HEAVY WEAVE CONSTRUCTION &nbsp;
              <span className="text-[#00D2FF]/40">◆</span>
              &nbsp;LUXURY YKK HARDWARE &nbsp;
              <span className="text-[#00D2FF]/40">◆</span>
              &nbsp;OVERSIZED ARCHITECTURAL SILHOUETTE &nbsp;
              <span className="text-[#00D2FF]/40">◆</span>
              &nbsp;PBR STUDIO MATERIALS &nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-12 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 pb-16 border-b border-white/[0.05]">

            {/* Brand + Newsletter */}
            <div className="lg:col-span-5 flex flex-col gap-7">
              <div>
                <h3 className="text-2xl font-black tracking-[0.38em] uppercase font-display text-white text-glow-white mb-2">
                  AURA<span className="text-[#00D2FF]">.</span>STREET
                </h3>
                <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-600 font-mono">
                  Paris-Originated // Drop Culture
                </p>
              </div>

              <p className="text-xs text-neutral-400 max-w-sm tracking-wider leading-[1.9] font-mono">
                Subscribe to drop notifications, editorial releases, and private collections access.
              </p>

              {/* Glass Email Input */}
              <form onSubmit={handleSubscribe} className="relative max-w-sm">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your email address"
                    aria-label="Enter email address for drop notifications"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full py-4 bg-white/[0.03] border border-white/10 focus:border-[#00D2FF]/60 rounded-xl px-5 text-[10px] tracking-[0.2em] font-mono font-medium text-white placeholder:text-neutral-600 outline-none transition-all duration-300 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(0,210,255,0.08)]"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-neutral-400 hover:text-black active:scale-95 transition-all cursor-pointer bg-white/[0.06] hover:bg-[#00D2FF] rounded-xl"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
                {subscribed && (
                  <p className="mt-2 text-[9px] uppercase tracking-[0.22em] text-[#00D2FF] font-mono font-bold">
                    ✓ Access Granted // Subscribed
                  </p>
                )}
              </form>
            </div>

            {/* Link Columns */}
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

              {/* Socials */}
              <div className="flex flex-col gap-6 col-span-2 sm:col-span-1 font-mono">
                <h4 className="text-[10px] uppercase tracking-[0.28em] font-bold text-white">Follow</h4>
                <ul className="flex flex-col gap-3">
                  {socials.map(({ label, icon: Icon, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-all duration-300"
                        aria-label={`Follow on ${label}`}
                      >
                        <span className="flex items-center justify-center w-8 h-8 rounded-xl border border-white/10 group-hover:border-[#00D2FF]/40 group-hover:bg-[#00D2FF]/[0.06] group-hover:text-[#00D2FF] transition-all duration-300 text-neutral-500">
                          <Icon />
                        </span>
                        {label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:text-[#00D2FF] transition-all duration-300 ml-auto" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Strip */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-[9px] uppercase tracking-[0.22em] text-neutral-500 font-mono">
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 sm:gap-x-8 gap-y-2">
              <span>© {new Date().getFullYear()} AURA STREET LTD.</span>
              <Link href="/privacy" className="hover:text-[#00D2FF] transition-colors duration-300">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#00D2FF] transition-colors duration-300">Terms of Use</Link>
              <Link href="/contact" className="hover:text-[#00D2FF] transition-colors duration-300">Contact</Link>
            </div>

            <button
              onClick={scrollToTop}
              aria-label="Back to top of page"
              className="group flex items-center gap-2.5 text-neutral-400 hover:text-white active:scale-95 transition-all cursor-pointer border border-white/[0.12] bg-white/[0.03] hover:border-[#00D2FF]/40 hover:bg-[#00D2FF]/[0.04] px-5 py-2.5 rounded-2xl backdrop-blur-md font-bold shadow-lg"
              data-magnetic
            >
              <span>Back to Top</span>
              <span className="text-[#00D2FF] font-black group-hover:-translate-y-0.5 transition-transform duration-300">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="flex flex-col gap-6 font-mono">
      <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">{title}</h4>
      <ul className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-400">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              className="hover:text-[#00D2FF] transition-all duration-300 hover:translate-x-0.5 inline-block"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
