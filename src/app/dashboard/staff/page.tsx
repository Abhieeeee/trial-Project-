"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product, Order } from "@/types/database";
import {
  Package,
  Receipt,
  Search,
  AlertTriangle,
  Lock,
  ChevronDown,
  ChevronUp,
  Truck,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NicheAnalyticsHub } from "@/components/admin/NicheAnalyticsHub";

export default function StaffWorkspace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Search & Filter state
  const [productSearch, setProductSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const supabase = createClient();

  const loadData = async () => {
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
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.id.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = categoryFilter === "all" || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.order_code.toLowerCase().includes(orderSearch.toLowerCase()) || o.customer_email.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const lowStockCount = products.filter((p) => p.stock <= 15).length;
  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center font-mono text-[10px] uppercase tracking-widest text-[#00D2FF]">
        Syncing staff telemetry core...
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full border border-[#00D2FF]/30 bg-[#00D2FF]/10 text-[#00D2FF] text-[8px] font-mono uppercase tracking-[0.25em] font-bold">
              STAFF TELEMETRY // CLASSIFIED PROTOCOL
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            Staff Operations Terminal
          </h1>
          <p className="mt-1 max-w-xl text-[10px] uppercase tracking-widest text-neutral-400 font-mono leading-relaxed">
            Real-time telemetry feed of global apparel catalogs, SKU warehouse inventory levels, and order dispatch pipelines.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-neutral-300 text-[9px] font-mono font-bold uppercase tracking-wider">
          <Lock className="h-3.5 w-3.5 text-[#00D2FF]" /> Telemetry View Only
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Catalog SKUs Monitored", value: products.length, icon: Package, highlight: false },
          { label: "Pending Pack Queue", value: pendingOrdersCount, icon: Receipt, highlight: pendingOrdersCount > 0 },
          { label: "Low-Stock Urgent SKUs", value: lowStockCount, icon: AlertTriangle, highlight: lowStockCount > 0 },
        ].map((card, i) => (
          <div
            key={i}
            className={`glass-panel p-5 rounded-2xl border transition-all relative overflow-hidden ${
              card.highlight ? "border-[#00D2FF]/40 bg-[#00D2FF]/5 shadow-[0_0_20px_rgba(0,210,255,0.1)]" : "border-white/10 bg-[#0a0a0e]/70"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400">{card.label}</span>
              <card.icon className={`h-4 w-4 ${card.highlight ? "text-[#00D2FF]" : "text-neutral-500"}`} />
            </div>
            <p className={`mt-3 font-mono text-2xl font-bold tracking-wider ${card.highlight ? "text-[#00D2FF]" : "text-white"}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Embedded Niche Analytics Hub */}
      <NicheAnalyticsHub products={products} orders={orders} role="staff" onRefresh={loadData} />

      {/* Split Panels: Searchable Inventory & Expandable Orders Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Inventory Watch Panel */}
        <div className="glass-panel-glow rounded-2xl border border-white/15 bg-[#0a0a0e]/90 overflow-hidden space-y-4 shadow-2xl backdrop-blur-2xl">
          <div className="border-b border-white/10 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <Package className="h-4 w-4 text-[#00D2FF]" /> Catalog Stock Watch
            </h2>
            <div className="flex items-center gap-2 font-mono text-[9px]">
              <div className="relative flex-1 sm:w-36">
                <Search className="h-3 w-3 absolute left-2.5 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Filter SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg pl-7 pr-2 py-1.5 text-white placeholder-neutral-600 focus:outline-none focus:border-[#00D2FF]"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-lg px-2 py-1.5 text-neutral-300 focus:outline-none focus:border-[#00D2FF]"
              >
                <option value="all">All</option>
                <option value="Hoodies">Hoodies</option>
                <option value="Jackets">Jackets</option>
                <option value="Pants">Pants</option>
                <option value="Sneakers">Sneakers</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left border-collapse font-mono text-[10px]">
              <thead className="bg-black/80 sticky top-0 border-b border-white/10 text-neutral-400 uppercase tracking-widest">
                <tr>
                  <th className="px-5 py-3 font-bold">SKU</th>
                  <th className="px-5 py-3 font-bold">Item Name</th>
                  <th className="px-5 py-3 font-bold">Category</th>
                  <th className="px-5 py-3 font-bold text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-neutral-500 tracking-wider">
                      {product.id.substring(0, 8).toUpperCase()}...
                    </td>
                    <td className="px-5 py-3 text-white uppercase font-bold">
                      {product.name}
                    </td>
                    <td className="px-5 py-3 text-neutral-400">
                      {product.category}
                    </td>
                    <td className={`px-5 py-3 text-right font-bold ${product.stock <= 15 ? "text-amber-400" : "text-white"}`}>
                      {product.stock} Units
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Orders Feed Panel with Expandable Accordion */}
        <div className="glass-panel-glow rounded-2xl border border-white/15 bg-[#0a0a0e]/90 overflow-hidden space-y-4 shadow-2xl backdrop-blur-2xl">
          <div className="border-b border-white/10 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <Receipt className="h-4 w-4 text-[#00D2FF]" /> Order Dispatch Queue
            </h2>
            <div className="flex items-center gap-2 font-mono text-[9px]">
              <div className="relative flex-1 sm:w-36">
                <Search className="h-3 w-3 absolute left-2.5 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Order Code..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg pl-7 pr-2 py-1.5 text-white placeholder-neutral-600 focus:outline-none focus:border-[#00D2FF]"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-lg px-2 py-1.5 text-neutral-300 focus:outline-none focus:border-[#00D2FF]"
              >
                <option value="all">All</option>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-white/5 font-mono text-[10px]">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              let statusBadgeClass = "text-white bg-white/5 border-white/10";
              if (order.status === "Pending") statusBadgeClass = "text-amber-400 bg-amber-500/10 border-amber-500/30";
              else if (order.status === "Shipped") statusBadgeClass = "text-[#00D2FF] bg-[#00D2FF]/10 border-[#00D2FF]/30";
              else if (order.status === "Delivered") statusBadgeClass = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";

              return (
                <div key={order.id} className="transition-colors hover:bg-white/[0.02]">
                  {/* Collapsed Header Row */}
                  <div
                    onClick={() => toggleExpand(order.id)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-bold text-white tracking-wider shrink-0">{order.order_code}</span>
                      <span className="text-neutral-400 truncate hidden sm:inline">{order.customer_name || order.customer_email}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-white">€{order.total}</span>
                      <span className={`px-2 py-0.5 rounded-full border text-[8px] uppercase font-bold ${statusBadgeClass}`}>
                        {order.status}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                      )}
                    </div>
                  </div>

                  {/* Expandable Secondary Details Accordion */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="px-4 pb-4 pt-1 bg-black/40 border-t border-white/5 space-y-2 text-[9px] uppercase tracking-wider text-neutral-300"
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-neutral-400">
                            <MapPin className="w-3 h-3 text-[#00D2FF]" /> Shipping Destination:
                          </span>
                          <span className="text-white font-bold">{order.shipping_address || "Kathmandu Valley, Nepal"}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-neutral-400">
                            <Truck className="w-3 h-3 text-[#00D2FF]" /> Notes & Payment Mode:
                          </span>
                          <span className="text-neutral-200">{order.notes || "Standard Express Delivery"}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
