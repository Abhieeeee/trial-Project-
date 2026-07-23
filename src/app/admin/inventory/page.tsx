"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Barcode, Boxes, Warehouse, Plus, Minus, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const supabase = createClient();

  const fetchInventory = async () => {
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
    fetchInventory();
  }, []);

  const adjustStock = async (productId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    setUpdatingId(productId);
    
    const { error } = await supabase
      .from("products")
      .update({ stock: newStock, updated_at: new Date().toISOString() })
      .eq("id", productId);

    if (!error) {
      setProducts(prev =>
        prev.map(p => (p.id === productId ? { ...p, stock: newStock } : p))
      );
    }
    setUpdatingId(null);
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const lowStockThreshold = 15;
  const lowStockProducts = products.filter(p => Number(p.stock || 0) < lowStockThreshold);
  const totalItems = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-sans font-extrabold uppercase tracking-wider text-white mb-2">Inventory</h1>
          <p className="text-xs text-neutral-400 uppercase tracking-widest">
            Stock levels telemetry, low-stock adjustments, and warehouse tracking.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        {[
          { icon: Boxes, title: "Tracked SKUs", value: loading ? "..." : products.length, color: "text-brand-sky" },
          { icon: AlertTriangle, title: "Low Stock Items", value: loading ? "..." : lowStockProducts.length, color: lowStockProducts.length > 0 ? "text-red-400" : "text-neutral-500" },
          { icon: Barcode, title: "Total Units", value: loading ? "..." : totalItems, color: "text-emerald-400" },
          { icon: Warehouse, title: "Active Warehouses", value: "3", color: "text-violet-400" },
        ].map((item) => (
          <div key={item.title} className="glass-panel-glow rounded-xl p-5">
            <item.icon className={`w-5 h-5 ${item.color} mb-4`} />
            <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 mb-2">{item.title}</p>
            <div className="text-2xl font-display font-bold text-white">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6">
        <input
          type="text"
          placeholder="Filter SKUs or names..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md w-full bg-black border border-neutral-800 rounded-lg py-2 px-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-brand-sky text-white placeholder:text-neutral-600"
        />
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs uppercase tracking-widest text-neutral-500">
            Loading inventory table...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-xs uppercase tracking-widest text-neutral-500">
            No matching inventory items.
          </div>
        ) : (
          filteredProducts.map((product, index) => {
            const stock = Number(product.stock || 0);
            const isLow = stock < lowStockThreshold;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="grid grid-cols-2 md:grid-cols-5 gap-4 p-5 border-b border-neutral-800 last:border-b-0 text-[10px] uppercase tracking-[0.18em] text-neutral-500 items-center hover:bg-white/[0.01] transition-colors"
              >
                <div>
                  <span className="block text-white font-bold">{product.id}</span>
                  SKU
                </div>
                <div className="md:col-span-2">
                  <span className="block text-white font-bold">{product.name}</span>
                  {product.category}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adjustStock(product.id, stock, -1)}
                      disabled={updatingId === product.id || stock === 0}
                      className="p-1 border border-neutral-800 hover:border-brand-sky rounded bg-black text-white hover:text-brand-sky cursor-pointer disabled:opacity-50"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className={`text-xs font-bold w-12 text-center ${isLow ? "text-red-400 font-extrabold" : "text-white"}`}>
                      {stock}
                    </span>
                    <button
                      onClick={() => adjustStock(product.id, stock, 1)}
                      disabled={updatingId === product.id}
                      className="p-1 border border-neutral-800 hover:border-brand-sky rounded bg-black text-white hover:text-brand-sky cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-[8px] text-neutral-600 tracking-wider">Adjust Stock</span>
                </div>
                <div>
                  <span className="block text-white">Paris WH</span>
                  Warehouse
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
