"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Check,
  Info,
  Smartphone,
  Play,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  Filter,
  Eye,
  MousePointerClick,
  Layers,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { useToast } from "@/components/Toast";
import { useCart } from "@/lib/cartContext";
import { useCurrency } from "@/lib/currency";

export interface AffiliateProduct {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  category: string;
  image: string;
  isAffiliate: boolean;
  affiliatePlatform: "amazon" | "tiktok_shop";
  affiliateUrl: string;
  amazonAsin?: string;
  primeEligible?: boolean;
  tiktokViews?: string;
  tiktokLikes?: string;
  rating?: number;
  description: string;
}

const sampleAffiliateProducts: AffiliateProduct[] = [
  {
    id: "AFF-AMZ-001",
    name: "Cyberpunk LED Futuristic Visor Glasses",
    price: "USD 29.99",
    numericPrice: 29.99,
    category: "Cyber Gear",
    image: "/hero-editorial.png",
    isAffiliate: true,
    affiliatePlatform: "amazon",
    affiliateUrl: "https://www.amazon.com/dp/B08XYZ1234?tag=aurastreet-20",
    amazonAsin: "B08XYZ1234",
    primeEligible: true,
    tiktokViews: "1.4M",
    tiktokLikes: "245K",
    rating: 4.8,
    description: "Multi-color LED futuristic luminescent eyewear with sound activation. Perfect fit check accessory for short-form video clips.",
  },
  {
    id: "AFF-AMZ-002",
    name: "Modular Tactical Chest Rig Harness",
    price: "USD 45.00",
    numericPrice: 45.00,
    category: "Tactical",
    image: "/tech-cargos.png",
    isAffiliate: true,
    affiliatePlatform: "amazon",
    affiliateUrl: "https://www.amazon.com/dp/B09ABC5678?tag=aurastreet-20",
    amazonAsin: "B09ABC5678",
    primeEligible: true,
    tiktokViews: "890K",
    tiktokLikes: "112K",
    rating: 4.9,
    description: "Heavy-duty waterproof Cordura chest pouch with quick-release clips. Aesthetic techwear layer featured in Shibuya Tokyo street style videos.",
  },
  {
    id: "AFF-AMZ-003",
    name: "Cyberpunk Waterproof Hard-Shell Backpack",
    price: "USD 79.99",
    numericPrice: 79.99,
    category: "Bags",
    image: "/street-sneaker.png",
    isAffiliate: true,
    affiliatePlatform: "amazon",
    affiliateUrl: "https://www.amazon.com/dp/B07DEF9012?tag=aurastreet-20",
    amazonAsin: "B07DEF9012",
    primeEligible: true,
    tiktokViews: "2.1M",
    tiktokLikes: "380K",
    rating: 4.7,
    description: "Geometric polycarbonate hard shell backpack with integrated TSA lock & USB charging port. High-demand techwear travel gear.",
  },
  {
    id: "AS-HDY-001",
    name: "Aura 3D Heavyweight Hoodie",
    price: "EUR 245.00",
    numericPrice: 245.00,
    category: "Brand Apparel",
    image: "/hero-editorial.png",
    isAffiliate: false,
    affiliatePlatform: "amazon",
    affiliateUrl: "",
    tiktokViews: "3.5M",
    tiktokLikes: "620K",
    rating: 5.0,
    description: "Direct AURA STREET brand product. 450GSM organic heavy fleece with sky-blue internal hardware.",
  },
];

export default function AffiliateLabPage() {
  const { toast } = useToast();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  // Feature Toggle State Matrix ("Which to put, which not to put")
  const [toggles, setToggles] = useState({
    showPrimeBadge: true,
    showTikTokStats: true,
    showAnalyticsTracker: true,
    showVideoPreview: true,
    showDirectCheckout: true,
    showPriceComparison: true,
  });

  // Outbound Affiliate Click Counter for Testing
  const [clickLogs, setClickLogs] = useState<Array<{ name: string; asin?: string; time: string }>>([]);

  const toggleFeature = (key: keyof typeof toggles) => {
    setToggles((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast({
        type: "info",
        title: "Feature Toggle Updated",
        description: `${key} is now ${next[key] ? "ENABLED (Put in website)" : "DISABLED (Excluded)"}`,
      });
      return next;
    });
  };

  const handleAffiliateClick = (item: AffiliateProduct) => {
    const time = new Date().toLocaleTimeString();
    setClickLogs((prev) => [{ name: item.name, asin: item.amazonAsin, time }, ...prev.slice(0, 4)]);

    toast({
      type: "success",
      title: "Amazon Affiliate Click Tracked!",
      description: `Logged outbound click to Amazon for ${item.name} (${item.amazonAsin || "ASIN"})`,
    });

    // Simulate opening Amazon affiliate URL
    window.open(item.affiliateUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 font-sans space-y-16">
        
        {/* Hidden Lab Header */}
        <div className="glass-panel-glow p-8 md:p-12 rounded-3xl border border-[#00D2FF]/30 bg-[#0a0a0e]/95 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00D2FF]/[0.06] rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[10px] uppercase tracking-[0.3em] text-[#00D2FF] font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CONFIDENTIAL LAB // HIDDEN TRIAL PAGE</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-[0.06em] font-display text-white">
                Amazon Affiliate & TikTok Funnel Lab
              </h1>
              <p className="text-xs md:text-sm text-neutral-300 max-w-2xl font-mono leading-relaxed">
                This hidden page is only visible to you for testing. Toggle features below to preview how Amazon affiliate products behave alongside your direct AURA STREET brand items.
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/10 text-center font-mono space-y-1 shrink-0">
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 block">Outbound Clicks Tracked</span>
              <span className="text-3xl font-black text-[#00D2FF] block font-display">{clickLogs.length}</span>
              <span className="text-[8px] text-emerald-400 block font-bold uppercase">● Real-time Logger Active</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: Plan Explanation */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#00D2FF]" />
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#00D2FF] font-mono font-bold">
              01 // How The Amazon + TikTok Funnel Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 bg-white/[0.02]">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white uppercase text-sm font-display">1. TikTok Short Video</h3>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Create 15-second fit-check or techwear review videos showing the product in action. Add "Link in bio for fit details & gear list".
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 bg-white/[0.02]">
              <div className="w-10 h-10 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/30 flex items-center justify-center text-[#00D2FF]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white uppercase text-sm font-display">2. Landing Page (`/tiktok`)</h3>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Traffic lands on your mobile-optimized hub. Displays both your €245 Brand Hoodies (Direct Checkout) and $30 Amazon Cyber Glasses (Affiliate).
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 bg-white/[0.02]">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white uppercase text-sm font-display">3. Dual Revenue Stream</h3>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Customers buy brand clothing on AURA STREET while clicking Amazon links for accessories. You earn Amazon commission + full brand profit with 0 inventory risk!
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: Feature Selection Matrix ("Which to put, which not to put") */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#00D2FF]" />
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#00D2FF] font-mono font-bold">
                02 // Interactive Feature Selector Matrix
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Click switches to test live card rendering</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {[
              { key: "showPrimeBadge" as const, title: "Amazon Prime Badge", desc: "Display 'Prime 1-Day Delivery' badge on affiliate cards" },
              { key: "showTikTokStats" as const, title: "TikTok Views & Likes Counter", desc: "Show social proof metrics (e.g. 1.4M TikTok Views)" },
              { key: "showAnalyticsTracker" as const, title: "Outbound Click Logger", desc: "Silently track Amazon clicks in Supabase analytics table" },
              { key: "showVideoPreview" as const, title: "TikTok Video Preview Tag", desc: "Display video play icon & viral tags on product images" },
              { key: "showDirectCheckout" as const, title: "Hybrid Brand Checkout", desc: "Keep local cart for AURA STREET items side-by-side" },
              { key: "showPriceComparison" as const, title: "Price & Platform Label", desc: "Explicitly display 'Fulfilled by Amazon' label" },
            ].map(({ key, title, desc }) => {
              const active = toggles[key];
              return (
                <button
                  key={key}
                  onClick={() => toggleFeature(key)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-4 cursor-pointer ${
                    active
                      ? "bg-[#00D2FF]/[0.08] border-[#00D2FF]/40 text-white shadow-[0_0_20px_rgba(0,210,255,0.1)]"
                      : "bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white"
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                      {title}
                    </p>
                    <p className="text-[10px] text-neutral-400 leading-relaxed font-mono">{desc}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      active ? "bg-[#00D2FF] text-black" : "bg-white/10 text-neutral-500"
                    }`}
                  >
                    {active ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "OFF"}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: Live Interactive Card Testing Showcase */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#00D2FF]" />
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#00D2FF] font-mono font-bold">
                03 // Live Hybrid Product Grid Preview
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#00D2FF] uppercase font-bold">Test clicking 'Buy on Amazon' vs 'Add to Bag'</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleAffiliateProducts.map((product) => (
              <div
                key={product.id}
                className="group glass-panel rounded-2xl border border-white/10 hover:border-[#00D2FF]/40 transition-all duration-300 p-4 bg-[#0a0a0e] flex flex-col justify-between space-y-4"
              >
                {/* Image Frame */}
                <div className="relative aspect-square w-full bg-neutral-900 rounded-xl overflow-hidden border border-white/5">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2 z-10 font-mono text-[8px] uppercase tracking-wider font-bold">
                    {product.isAffiliate ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 backdrop-blur-md">
                        Amazon Affiliate
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-[#00D2FF]/20 border border-[#00D2FF]/40 text-[#00D2FF] backdrop-blur-md">
                        AURA STREET Direct
                      </span>
                    )}

                    {toggles.showPrimeBadge && product.primeEligible && (
                      <span className="px-2 py-0.5 rounded bg-sky-500 text-black font-extrabold flex items-center gap-1 shadow-md">
                        <Zap className="w-2.5 h-2.5 fill-black" /> Prime 1-Day
                      </span>
                    )}
                  </div>

                  {toggles.showTikTokStats && product.tiktokViews && (
                    <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/80 border border-white/15 text-[8px] font-mono text-purple-300 flex items-center gap-1.5 backdrop-blur-md">
                      <Play className="w-2.5 h-2.5 fill-purple-300" />
                      <span>{product.tiktokViews} TikTok Views</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-white uppercase text-xs truncate" title={product.name}>
                      {product.name}
                    </h3>
                  </div>

                  <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-white font-extrabold text-sm font-display">
                      {product.price}
                    </span>
                    {toggles.showPriceComparison && (
                      <span className="text-[8px] text-neutral-500 uppercase tracking-widest">
                        {product.isAffiliate ? "Fulfilled by Amazon" : "In Stock Direct"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div>
                  {product.isAffiliate ? (
                    <button
                      onClick={() => handleAffiliateClick(product)}
                      className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer"
                    >
                      <span>Buy on Amazon</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    toggles.showDirectCheckout && (
                      <button
                        onClick={() => {
                          addItem({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            numericPrice: product.numericPrice,
                            category: product.category,
                            image: product.image,
                            quantity: 1,
                          });
                          toast({ type: "success", title: "Added to Bag", description: `${product.name} added to AURA STREET cart` });
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-[#00D2FF] hover:bg-cyan-400 text-black font-extrabold font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,210,255,0.2)] cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Real-time Outbound Click Tracker Log */}
        {toggles.showAnalyticsTracker && (
          <section className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 bg-black/60 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-[#00D2FF]">
                <MousePointerClick className="w-4 h-4" />
                <h3 className="font-bold uppercase tracking-wider">Outbound Amazon Affiliate Click Simulator Log</h3>
              </div>
              <span className="text-[9px] text-neutral-500 uppercase">Updates live on click</span>
            </div>

            {clickLogs.length === 0 ? (
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest text-center py-4">
                No outbound affiliate clicks logged yet. Click 'Buy on Amazon' above to test event tracking.
              </p>
            ) : (
              <div className="space-y-2">
                {clickLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-between text-[10px] text-neutral-300"
                  >
                    <span className="text-white font-bold">{log.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-amber-400">ASIN: {log.asin || "N/A"}</span>
                      <span className="text-neutral-500">{log.time}</span>
                      <span className="text-emerald-400 font-bold uppercase">✓ Tracked</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </div>
    </PageShell>
  );
}
