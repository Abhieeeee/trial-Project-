"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product, Order } from "@/types/database";
import {
  Package,
  Receipt,
  Sparkles,
  Search,
  Filter,
  AlertTriangle,
  Lock,
  Zap,
  TrendingUp,
} from "lucide-react";
import { NicheAnalyticsHub } from "@/components/admin/NicheAnalyticsHub";

export default function StaffWorkspace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
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

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-[10px] uppercase tracking-widest text-amber-400">
        Syncing staff telemetry core...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* Header Banner */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-amber-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[8px] font-mono uppercase tracking-[0.2em] font-bold">
              CLASSIFIED // READ-ONLY ACCESS PROTOCOL
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-[0.15em] text-white">
            Staff Operations Terminal
          </h1>
          <p className="mt-2 max-w-xl text-[10px] uppercase tracking-[0.12em] text-neutral-400 font-mono">
            System operational. Real-time telemetry feed of global apparel catalogs, SKU warehouse inventory levels, and order dispatch pipelines.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-3 border border-amber-500/20 bg-amber-500/5 text-amber-400 text-[9px] font-mono font-bold uppercase tracking-wider">
          <Lock className="h-4 w-4" /> Telemetry Only (Import/Export Restricted)
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Catalog SKUs Monitored", value: products.length, icon: Package, highlight: false },
          { label: "Pending Pack Queue", value: pendingOrdersCount, icon: Receipt, highlight: pendingOrdersCount > 0 },
          { label: "Low-Stock Urgent SKUs", value: lowStockCount, icon: AlertTriangle, highlight: lowStockCount > 0 },
        ].map((card, i) => (
          <div key={i} className={`bg-black/40 backdrop-blur-md border ${card.highlight ? "border-amber-500/40 bg-amber-500/5" : "border-neutral-800"} rounded-none p-6 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <card.icon className="h-10 w-10 text-amber-400" />
            </div>
            <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-neutral-500">{card.label}</p>
            <p className={`mt-3 font-mono text-2xl font-bold tracking-widest ${card.highlight ? "text-amber-400" : "text-white"}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Embedded Niche Analytics Hub (Staff Theme) */}
      <NicheAnalyticsHub products={products} orders={orders} role="staff" onRefresh={loadData} />

      {/* Split Panels: Searchable Inventory & Orders Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Inventory Watch Panel */}
        <div className="bg-black/40 backdrop-blur-md border border-neutral-800 rounded-none overflow-hidden space-y-4">
          <div className="border-b border-neutral-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <Package className="h-4 w-4 text-amber-400" /> Catalog Stock Watch
            </h2>
            <div className="flex items-center gap-2 font-mono text-[9px]">
              <div className="relative flex-1 sm:w-40">
                <Search className="h-3 w-3 absolute left-2.5 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Filter SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 pl-7 pr-2 py-1 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 px-2 py-1 text-neutral-300 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Categories</option>
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
              <thead className="bg-neutral-950 sticky top-0 border-b border-neutral-800 text-neutral-500 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3 font-bold">SKU</th>
                  <th className="px-6 py-3 font-bold">Item Name</th>
                  <th className="px-6 py-3 font-bold">Category</th>
                  <th className="px-6 py-3 font-bold text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.01]">
                    <td className="px-6 py-3.5 text-neutral-500 tracking-wider">
                      {product.id.substring(0, 8).toUpperCase()}...
                    </td>
                    <td className="px-6 py-3.5 text-white uppercase font-bold">
                      {product.name}
                    </td>
                    <td className="px-6 py-3.5 text-neutral-400">
                      {product.category}
                    </td>
                    <td className={`px-6 py-3.5 text-right font-bold ${product.stock <= 15 ? "text-amber-400" : "text-white"}`}>
                      {product.stock} Units
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Orders Feed Panel */}
        <div className="bg-black/40 backdrop-blur-md border border-neutral-800 rounded-none overflow-hidden space-y-4">
          <div className="border-b border-neutral-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <Receipt className="h-4 w-4 text-amber-400" /> Order Dispatch Telemetry
            </h2>
            <div className="flex items-center gap-2 font-mono text-[9px]">
              <div className="relative flex-1 sm:w-40">
                <Search className="h-3 w-3 absolute left-2.5 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Order Code..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 pl-7 pr-2 py-1 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 px-2 py-1 text-neutral-300 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left border-collapse font-mono text-[10px]">
              <thead className="bg-neutral-950 sticky top-0 border-b border-neutral-800 text-neutral-500 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3 font-bold">Code</th>
                  <th className="px-6 py-3 font-bold">Customer Email</th>
                  <th className="px-6 py-3 font-bold">Total</th>
                  <th className="px-6 py-3 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {filteredOrders.map((order) => {
                  let statusClass = "text-white";
                  if (order.status === "Pending") statusClass = "text-amber-400 font-bold";
                  else if (order.status === "Shipped") statusClass = "text-sky-400 font-bold";
                  else if (order.status === "Delivered") statusClass = "text-emerald-400 font-bold";
                  else if (order.status === "Cancelled") statusClass = "text-red-500";

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.01]">
                      <td className="px-6 py-3.5 text-white font-bold tracking-wider">
                        {order.order_code}
                      </td>
                      <td className="px-6 py-3.5 text-neutral-400 truncate max-w-[140px]">
                        {order.customer_email}
                      </td>
                      <td className="px-6 py-3.5 text-white font-bold">
                        EUR {order.total}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <span className={`uppercase font-bold tracking-wider ${statusClass}`}>
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
