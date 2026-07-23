"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Edit, Plus, Search, Upload, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = createClient();

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (!error && data) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate live stats
  const totalStock = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const avgPrice = products.length > 0 
    ? Math.round(products.reduce((sum, p) => sum + Number(p.price || 0), 0) / products.length)
    : 0;
  const lowStockCount = products.filter(p => Number(p.stock || 0) < 15).length;

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-sans font-extrabold uppercase tracking-wider text-white mb-2">Products</h1>
          <p className="text-xs text-neutral-400 uppercase tracking-widest">
            Add products, variants, tags, product media, and bulk upload inventory.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-3 rounded bg-neutral-900 border border-neutral-800 text-[10px] uppercase tracking-widest font-bold text-neutral-400 hover:text-white cursor-pointer transition-colors">
            <Upload className="w-4 h-4 inline mr-2" />
            Bulk Upload
          </button>
          <button className="px-4 py-3 rounded bg-white text-black hover:bg-brand-sky text-[10px] uppercase tracking-widest font-bold cursor-pointer transition-colors">
            <Plus className="w-4 h-4 inline mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel-glow p-4 rounded-xl">
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Total Products</div>
          <div className="text-xl font-display font-bold text-white">{loading ? "..." : products.length}</div>
        </div>
        <div className="glass-panel-glow p-4 rounded-xl">
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Total Stock (Units)</div>
          <div className="text-xl font-display font-bold text-sky-400">{loading ? "..." : totalStock}</div>
        </div>
        <div className="glass-panel-glow p-4 rounded-xl">
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Average Price</div>
          <div className="text-xl font-display font-bold text-emerald-400">{loading ? "..." : `EUR ${avgPrice}`}</div>
        </div>
        <div className="glass-panel-glow p-4 rounded-xl">
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Low Stock Alerts</div>
          <div className="text-xl font-display font-bold text-red-400">{loading ? "..." : lowStockCount}</div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-brand-sky text-white placeholder:text-neutral-600"
            placeholder="Search products by name or category..."
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-neutral-500 text-xs uppercase tracking-widest">
          Loading products database...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 text-xs uppercase tracking-widest">
          No products found matching query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => {
            const hasStock = Number(product.stock || 0) > 0;
            const isLowStock = Number(product.stock || 0) < 15;
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-panel-glow rounded-xl overflow-hidden group"
              >
                <div className="relative aspect-[16/10] bg-black">
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600 tracking-widest uppercase">
                      No Image Available
                    </div>
                  )}
                  {isLowStock && (
                    <span className="absolute top-3 left-3 bg-red-500/90 text-white font-extrabold text-[8px] uppercase tracking-widest px-2 py-1 rounded">
                      Low Stock
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-sm uppercase tracking-[0.16em] font-bold text-white">{product.name}</h2>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-2">
                        {product.id} // {product.category}
                      </p>
                    </div>
                    <button className="p-2 rounded border border-neutral-800 hover:border-brand-sky hover:text-brand-sky cursor-pointer transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-6 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                    <div>
                      <span className="block text-white font-bold">EUR {product.price}</span>
                      Price
                    </div>
                    <div>
                      <span className={`block font-bold ${!hasStock ? "text-red-500" : isLowStock ? "text-yellow-500" : "text-emerald-400"}`}>
                        {product.stock}
                      </span>
                      Stock
                    </div>
                    <div>
                      <span className="block text-white font-bold">{product.colorways || 1}</span>
                      Colorways
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
