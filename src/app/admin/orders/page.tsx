"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Filter, Search, Truck, Check, X } from "lucide-react";
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
      (order.customer_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer_email || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate live stats
  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pendingCount = orders.filter(o => o.status === "Pending").length;
  const shippedCount = orders.filter(o => o.status === "Shipped").length;

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-white mb-2">Orders</h1>
          <p className="text-xs text-neutral-400 uppercase tracking-widest">
            Live database fulfillment, status transitions, and customer tracking.
          </p>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel-glow p-4 rounded-xl">
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Total Orders</div>
          <div className="text-xl font-display font-bold text-white">{loading ? "..." : orders.length}</div>
        </div>
        <div className="glass-panel-glow p-4 rounded-xl">
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Awaiting Dispatch</div>
          <div className="text-xl font-display font-bold text-amber-400">{loading ? "..." : pendingCount}</div>
        </div>
        <div className="glass-panel-glow p-4 rounded-xl">
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">In Transit</div>
          <div className="text-xl font-display font-bold text-sky-400">{loading ? "..." : shippedCount}</div>
        </div>
        <div className="glass-panel-glow p-4 rounded-xl">
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Gross Revenue</div>
          <div className="text-xl font-display font-bold text-emerald-400">
            {loading ? "..." : `EUR ${totalRevenue.toLocaleString()}`}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search order ID or customer..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full bg-black border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-brand-sky transition-colors text-white placeholder:text-neutral-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <Filter className="w-4 h-4 text-neutral-500 mr-2 shrink-0" />
          {(["All", "Pending", "Shipped", "Delivered", "Cancelled"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded text-[9px] uppercase tracking-widest font-bold whitespace-nowrap transition-colors cursor-pointer ${
                filter === status
                  ? "bg-brand-sky/20 text-brand-sky border border-brand-sky/30"
                  : "bg-black border border-neutral-800 text-neutral-500 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 border-b border-neutral-800 text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 text-xs uppercase tracking-widest">
                    Fetching orders database...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 text-xs uppercase tracking-widest">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => (
                  <tr
                    key={order.id}
                    className="border-b border-neutral-800 hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-bold text-white tracking-widest">
                        {order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <div className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">
                        {order.items?.length || 0} Item(s)
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-white mb-1">{order.customer_name || "Guest Customer"}</div>
                      <div className="text-[9px] text-neutral-500 uppercase tracking-widest">{order.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 text-[10px] text-neutral-400 uppercase tracking-widest">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-brand-sky text-glow-sky">
                      EUR {Number(order.total || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === "Pending" && (
                          <button
                            onClick={() => updateStatus(order.id, "Shipped")}
                            disabled={updatingId === order.id}
                            className="p-1.5 bg-black border border-neutral-800 rounded hover:text-brand-sky hover:border-brand-sky/50 transition-colors cursor-pointer"
                            title="Mark as Shipped"
                          >
                            <Truck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {order.status === "Shipped" && (
                          <button
                            onClick={() => updateStatus(order.id, "Delivered")}
                            disabled={updatingId === order.id}
                            className="p-1.5 bg-black border border-neutral-800 rounded hover:text-green-400 hover:border-green-400/50 transition-colors cursor-pointer"
                            title="Mark as Delivered"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {order.status !== "Cancelled" && order.status !== "Delivered" && (
                          <button
                            onClick={() => updateStatus(order.id, "Cancelled")}
                            disabled={updatingId === order.id}
                            className="p-1.5 bg-black border border-neutral-800 rounded hover:text-red-500 hover:border-red-500/50 transition-colors cursor-pointer"
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

        <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-neutral-500">
          <div>Showing {filteredOrders.length} results</div>
        </div>
      </div>
    </div>
  );
}
