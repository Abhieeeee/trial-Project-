"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product, Order } from "@/types/database";
import { Package, Receipt, Sparkles } from "lucide-react";

export default function StaffWorkspace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      try {
        const [prodResult, ordResult] = await Promise.all([
          supabase.from("products").select("*").order("name"),
          supabase.from("orders").select("*").order("created_at", { ascending: false }),
        ]);

        if (prodResult.data) setProducts(prodResult.data as Product[]);
        if (ordResult.data) setOrders(ordResult.data as Order[]);
      } catch (err) {
        console.error("Error loading staff workspace data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-[10px] uppercase tracking-widest text-neutral-500">
        Syncing local terminal database...
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <p className="mb-2 text-[8px] font-mono uppercase tracking-[0.3em] text-neutral-500">
          SECURE PROTOCOL // CLASSIFIED READ-ONLY ACCESS
        </p>
        <h1 className="font-display text-2xl font-bold uppercase tracking-[0.15em] text-white">
          Staff Workspace
        </h1>
        <p className="mt-2 max-w-xl text-[10px] uppercase tracking-[0.12em] text-neutral-500 font-mono">
          System operational. Real-time telemetry feed of global catalogs, item SKU storage quantities, and fulfillment status pipelines.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Catalog Items", value: products.length, icon: Package },
          { label: "Total Orders Monitored", value: orders.length, icon: Receipt },
          { label: "Physical Warehouse Stock", value: products.reduce((sum, p) => sum + p.stock, 0), icon: Sparkles },
        ].map((card, i) => (
          <div key={i} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-none p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <card.icon className="h-10 w-10 text-white" />
            </div>
            <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-neutral-500">{card.label}</p>
            <p className="mt-3 font-mono text-2xl font-bold text-white tracking-widest">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Split Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Inventory Panel */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-none overflow-hidden">
          <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <Package className="h-4 w-4" /> Global Catalog Inventory
            </h2>
            <span className="text-[8px] font-mono tracking-widest text-neutral-500 uppercase">
              READ_ONLY
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[10px]">
              <thead>
                <tr className="border-b border-white/5 text-neutral-500 uppercase tracking-widest">
                  <th className="px-6 py-4 font-bold">SKU ID</th>
                  <th className="px-6 py-4 font-bold">Item Name</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold text-right">Stock Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 text-neutral-400 tracking-wider">
                      {product.id.substring(0, 8).toUpperCase()}...
                    </td>
                    <td className="px-6 py-4 text-white uppercase font-semibold">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-neutral-400">
                      {product.category}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${product.stock <= 15 ? "text-amber-500" : "text-white"}`}>
                      {product.stock} Units
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Orders Feed */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-none overflow-hidden">
          <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <Receipt className="h-4 w-4" /> Recent Order Telemetry
            </h2>
            <span className="text-[8px] font-mono tracking-widest text-neutral-500 uppercase animate-pulse">
              LIVE_FEED
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[10px]">
              <thead>
                <tr className="border-b border-white/5 text-neutral-500 uppercase tracking-widest">
                  <th className="px-6 py-4 font-bold">Order Code</th>
                  <th className="px-6 py-4 font-bold">Customer Email</th>
                  <th className="px-6 py-4 font-bold">Timestamp</th>
                  <th className="px-6 py-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => {
                  let statusClass = "text-white";
                  if (order.status === "Pending") statusClass = "text-amber-400";
                  else if (order.status === "Shipped") statusClass = "text-blue-400";
                  else if (order.status === "Delivered") statusClass = "text-emerald-400";
                  else if (order.status === "Cancelled") statusClass = "text-red-500";

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4 text-white font-bold tracking-wider">
                        {order.order_code}
                      </td>
                      <td className="px-6 py-4 text-neutral-400 truncate max-w-[150px]">
                        {order.customer_email}
                      </td>
                      <td className="px-6 py-4 text-neutral-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 uppercase font-bold tracking-wider ${statusClass}`}>
                          <span className={`w-1 h-1 rounded-full ${order.status === "Pending" ? "bg-amber-400 animate-ping" : "currentColor"}`} />
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
