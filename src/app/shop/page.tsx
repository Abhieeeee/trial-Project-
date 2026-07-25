"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { RotateCcw, Search, ShieldCheck, SlidersHorizontal, Truck, ChevronDown, Share2, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoreProductCard from "@/components/StoreProductCard";
import { categories, products as fallbackProducts, type Product } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/client";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [productList, setProductList] = useState<Product[]>(fallbackProducts);

  // Fetch dynamic products from Supabase with fallback to catalog.ts
  useEffect(() => {
    async function loadDynamicProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true);

        if (data && data.length > 0 && !error) {
          const mapped: Product[] = data.map((p) => ({
            id: p.id,
            name: p.name,
            price: `€${p.price}.00`,
            numericPrice: Number(p.price),
            category: p.category as any,
            stock: p.stock,
            colorways: p.colorways || 1,
            material: p.material || "Technical Fabric",
            slug: p.name.toLowerCase().replace(/\s+/g, "-"),
            image: p.images && p.images[0] ? p.images[0] : "/moto-jacket.png",
            description: p.description || "",
            badge: p.stock < 15 ? "LOW STOCK" : undefined,
            details: [p.material, `${p.stock} units available`],
            sizes: ["S", "M", "L", "XL"],
          }));
          setProductList(mapped);
        }
      } catch (err) {
        console.error("Shop product fetch error, fallback active:", err);
      }
    }
    loadDynamicProducts();
  }, []);

  // Read initial values from URL search params
  const initialCat = searchParams.get("category") || "All";
  const initialQuery = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "featured";

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState(initialSort);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync state changes to URL query parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory && activeCategory !== "All") params.set("category", activeCategory);
    if (query.trim()) params.set("search", query.trim());
    if (sort && sort !== "featured") params.set("sort", sort);

    const queryString = params.toString();
    const newUrl = queryString ? `/shop?${queryString}` : "/shop";
    router.replace(newUrl, { scroll: false });
  }, [activeCategory, query, sort, router]);

  const sortLabels: Record<string, string> = {
    featured: "Featured",
    low: "Price low to high",
    high: "Price high to low",
    stock: "Low stock first",
  };

  const filteredProducts = useMemo(() => {
    return productList
      .filter((product) => activeCategory === "All" || product.category === activeCategory)
      .filter((product) => {
        const haystack = `${product.name} ${product.category} ${product.material} ${product.description}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
      .sort((a, b) => {
        if (sort === "low") return a.numericPrice - b.numericPrice;
        if (sort === "high") return b.numericPrice - a.numericPrice;
        if (sort === "stock") return a.stock - b.stock;
        return 0;
      });
  }, [activeCategory, query, sort]);

  const handleShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const clearFilters = () => {
    setActiveCategory("All");
    setQuery("");
    setSort("featured");
  };

  return (
    <main className="relative min-h-screen bg-black text-white w-full overflow-hidden pt-[140px] lg:pt-[180px]">
      <Header />

      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-neutral-300 mb-8 font-mono">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white font-bold">Shop</span>
            </div>
            
            <button
              onClick={handleShareLink}
              className="flex items-center gap-1.5 hover:text-[#00d2ff] active:scale-95 transition-all cursor-pointer"
              title="Copy shareable URL link"
              aria-label="Share view link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Link Copied!" : "Share View"}</span>
            </button>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-[0.18em] font-display text-white mb-10">
            SHOP ALL
          </h1>
          <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed tracking-widest mb-12 font-mono">
            FILTER PREMIUM HOODIES, JACKETS, PANTS, SNEAKERS, AND ACCESSORIES. EACH PIECE INCORPORATES OUR SIGNATURE FASHION GEOMETRY AND CYBER-LUXURY COMPOSITION.
          </p>

          <div className="glass-panel-glow rounded-xl p-4 mb-10 grid gap-4 lg:grid-cols-[1fr_auto_auto] items-center">
            {/* Search Input */}
            <label className="relative block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="SEARCH SPECIFICATIONS"
                aria-label="Search specifications"
                className="w-full bg-black border border-neutral-800 rounded-lg py-3.5 pl-12 pr-4 text-[10px] uppercase tracking-[0.2em] focus:outline-none focus:border-brand-sky focus:shadow-[0_0_12px_rgba(125,211,252,0.15)] transition-all text-white placeholder:text-neutral-500 font-mono"
              />
            </label>

            {/* Custom Interactive Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full lg:w-56 bg-black border border-neutral-800 rounded-lg py-3.5 px-4 text-[10px] uppercase tracking-[0.2em] text-neutral-300 hover:text-white focus:outline-none focus:border-brand-sky active:scale-95 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>SORT: {sortLabels[sort]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-full mt-2 bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden z-20 shadow-2xl"
                  >
                    {Object.entries(sortLabels).map(([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSort(key);
                          setDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-[10px] uppercase tracking-[0.2em] font-mono transition-colors cursor-pointer ${
                          sort === key
                            ? "bg-brand-sky/10 text-brand-sky font-bold"
                            : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reset Filters Trigger */}
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-black border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white active:scale-95 text-[10px] uppercase tracking-[0.2em] font-mono rounded-lg transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#00d2ff]" /> RESET
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-12">
            {["All", ...categories].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-[9px] uppercase tracking-[0.25em] font-mono active:scale-95 transition-all duration-220 border cursor-pointer ${
                  activeCategory === category
                    ? "bg-white text-black font-bold border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    : "bg-black/60 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <StoreProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 border border-neutral-800 rounded-xl bg-neutral-950/40">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-mono">
                No items match query parameters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2.5 bg-[#00d2ff] text-black font-bold text-[9px] uppercase tracking-widest rounded"
              >
                Reset Catalog Filters
              </button>
            </div>
          )}
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center font-mono text-[10px] text-[#00d2ff] uppercase tracking-widest">
        Loading catalog telemetry...
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
