"use client";

import { useState, useEffect } from "react";
import { Download, RefreshCw, Trash2, ShieldAlert, Sparkles, Box } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database";

export default function SuperAdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const adjustStockDirect = async (productId: string, newStockVal: number) => {
    setUpdatingId(productId);
    const { error } = await supabase
      .from("products")
      .update({ stock: newStockVal, updated_at: new Date().toISOString() })
      .eq("id", productId);

    if (!error) {
      setProducts(prev =>
        prev.map(p => (p.id === productId ? { ...p, stock: newStockVal } : p))
      );
    } else {
      alert(`Adjust stock failed: ${error.message}`);
    }
    setUpdatingId(null);
  };

  // Metrics
  const totalSkus = products.length;
  const totalUnits = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const lowStockCount = products.filter(p => Number(p.stock || 0) < 15).length;

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-red-500">Warehouse authority</p>
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-white">Warehouse Inventory</h1>
          <p className="mt-3 max-w-2xl text-xs uppercase tracking-[0.12em] text-neutral-400">
            Control warehouses, transfers, direct stock adjustments, stock thresholds, and SKUs.
          </p>
        </div>
        <button
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products));
            const downloadAnchor = document.createElement("a");
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "all_inventory.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="inline-flex items-center gap-2 rounded-md border border-neutral-700 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-white hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          Export report
        </button>
      </div>

      <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          ["Tracked SKUs", totalSkus.toString()],
          ["Units on hand", totalUnits.toString()],
          ["Low stock threshold (<15)", lowStockCount.toString()],
          ["Active Warehouses", "3"],
        ].map(([label, value]) => (
          <div key={label} className="glass-panel-glow rounded-lg p-5">
            <Box className="mb-4 h-4 w-4 text-red-500" />
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-500">{label}</p>
            <p className="mt-2 text-xl font-bold text-white">{loading ? "..." : value}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-800 p-5">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Stock Control List</h2>
          <span className="inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.14em] text-red-400">
            <ShieldAlert className="h-3.5 w-3.5" />Elevated controls enabled
          </span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-xs uppercase tracking-widest text-neutral-500">
            Loading warehouses stocks...
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-xs uppercase tracking-widest text-neutral-500">
            No tracked products found.
          </div>
        ) : (
          products.map((product) => {
            const stock = Number(product.stock || 0);
            return (
              <div key={product.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-800 p-5 last:border-0 md:grid-cols-[1fr_1fr_auto]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                    {product.name}
                  </p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.13em] text-neutral-500">
                    {product.id} / Paris warehouse
                  </p>
                </div>
                <div className="hidden text-[10px] uppercase tracking-[0.13em] text-neutral-400 md:block">
                  <span className={`font-bold ${stock < 15 ? "text-red-400" : "text-white"}`}>
                    {stock} units available
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newStockStr = prompt(`Set absolute stock for ${product.name}:`, stock.toString());
                      if (newStockStr !== null) {
                        const newStockVal = Number(newStockStr);
                        if (!isNaN(newStockVal) && newStockVal >= 0) {
                          adjustStockDirect(product.id, newStockVal);
                        }
                      }
                    }}
                    disabled={updatingId === product.id}
                    className="rounded-md border border-neutral-700 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.12em] text-white hover:border-red-500 cursor-pointer"
                  >
                    Adjust Stock
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
