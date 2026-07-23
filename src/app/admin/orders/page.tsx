"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Filter, Search, Truck, Check, X, Package, Clock, ShieldCheck, Sparkles, RefreshCw } from "lucide-react";
import { Badge } from "@/components/admin/Badge";
import { createClient } from "@/lib/supabase/client";
import type { Order, OrderStatus } from "@/types/database";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = createClient();

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as Order[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (!error) {
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
    setUpdatingId(null);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "All" || order.status === filter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.order_code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer_email || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pendingCount = orders.filter(o => o.status === "Pending").length;
  const shippedCount = orders.filter(o => o.status === "Shipped").length;
  const deliveredCount = orders.filter(o => o.status === "Delivered").length;

  return (
    <div className="pb-16 font-mono space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[8px] uppercase tracking-widest font-extrabold flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-400" /> FULFILLMENT QUEUE & ORDERS
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.15em] text-white font-display">
            Order Fulfillment Console
          </h1>
          <p className="mt-2 text-xs text-neutral-400 tracking-wide font-sans max-w-xl">
            Manage live orders, update tracking states, and process customer shipments.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00D2FF] text-white text-[9px] uppercase tracking-widest font-bold transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#00D2FF] ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel-glow p-5 rounded-2xl border border-white/10">
          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Total Queue Items</p>
          <p className="text-2xl font-extrabold text-white font-display">{loading ? "..." : orders.length}</p>
          <p className="text-[8px] text-neutral-500 mt-2 uppercase tracking-widest">Database Synced</p>
        </div>

        <div className="glass-panel-glow p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5">
          <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-2">Awaiting Dispatch</p>
          <p className="text-2xl font-extrabold text-amber-400 font-display">{loading ? "..." : pendingCount}</p>
          <p className="text-[8px] text-amber-500/80 mt-2 uppercase tracking-widest">Action Required</p>
        </div>

        <div className="glass-panel-glow p-5 rounded-2xl border border-sky-500/30 bg-sky-500/5">
          <p className="text-[9px] font-bold text-sky-400 uppercase tracking-widest mb-2">In Transit Items</p>
          <p className="text-2xl font-extrabold text-sky-400 font-display">{loading ? "..." : shippedCount}</p>
          <p className="text-[8px] text-sky-500/80 mt-2 uppercase tracking-widest">Courier Partner Handshake</p>
        </div>

        <div className="glass-panel-glow p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
          <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Gross Store Output</p>
          <p className="text-2xl font-extrabold text-emerald-400 font-display">
            {loading ? "..." : `€${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          </p>
          <p className="text-[8px] text-emerald-500/80 mt-2 uppercase tracking-widest">Completed Sales</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-black/60 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search order code, customer or email..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-[9px] uppercase tracking-widest focus:outline-none focus:border-[#00D2FF] transition-all text-white placeholder:text-neutral-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-neutral-500 mr-1 shrink-0" />
          {(["All", "Pending", "Shipped", "Delivered", "Cancelled"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3.5 py-2 rounded-lg text-[9px] uppercase tracking-widest font-extrabold transition-all cursor-pointer border ${
                filter === status
                  ? "bg-[#00D2FF]/10 text-[#00D2FF] border-[#00D2FF]/40 shadow-[0_0_10px_rgba(0,210,255,0.1)]"
                  : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="glass-panel-glow rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black/80 border-b border-white/10 text-[8px] font-bold uppercase tracking-[0.25em] text-neutral-400">
              <tr>
                <th className="px-6 py-4">Order Code</th>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Fulfillment Status</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4 text-right">Quick Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[10px]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 text-xs uppercase tracking-widest font-bold">
                    Fetching live orders queue...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 text-xs uppercase tracking-widest font-bold">
                    No orders matching selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-extrabold text-white text-xs tracking-wider">
                        {order.order_code || order.id.slice(0, 10).toUpperCase()}
                      </p>
                      <p className="text-[8px] text-neutral-500 uppercase tracking-widest mt-1">
                        {order.items?.length || 1} Garment(s)
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-[#00D2FF] flex items-center justify-center font-bold text-[9px]">
                          {order.customer_name ? order.customer_name.charAt(0) : "C"}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{order.customer_name || "Guest Collector"}</p>
                          <p className="text-[8px] text-neutral-500 tracking-wider">{order.customer_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[9px] text-neutral-400 uppercase tracking-wider">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={order.status} />
                    </td>
                    <td className="px-6 py-4 font-extrabold text-[#00D2FF] text-xs">
                      €{Number(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === "Pending" && (
                          <button
                            onClick={() => updateStatus(order.id, "Shipped")}
                            disabled={updatingId === order.id}
                            className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-lg text-[8px] uppercase tracking-widest font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Dispatch / Ship</span>
                          </button>
                        )}
                        {order.status === "Shipped" && (
                          <button
                            onClick={() => updateStatus(order.id, "Delivered")}
                            disabled={updatingId === order.id}
                            className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-[8px] uppercase tracking-widest font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Delivered</span>
                          </button>
                        )}
                        {order.status !== "Cancelled" && order.status !== "Delivered" && (
                          <button
                            onClick={() => updateStatus(order.id, "Cancelled")}
                            disabled={updatingId === order.id}
                            className="p-1.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg transition-all cursor-pointer"
                            title="Cancel Order"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between text-[9px] uppercase tracking-widest font-bold text-neutral-400 bg-black/40">
          <span>Displaying {filteredOrders.length} filtered fulfillment records</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Direct Database Persistence
          </span>
        </div>
      </div>

    </div>
  );
}
