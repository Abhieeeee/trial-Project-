"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Search, Eye, Truck } from "lucide-react";
import { Badge } from "@/components/admin/Badge";

// Mock Data
type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

const initialOrders = [
  { id: "ORD-8924", customer: "Alex Chen", email: "alex@example.com", date: "Jun 20, 2026", total: "€680.00", status: "Pending" as OrderStatus, items: 1 },
  { id: "ORD-8923", customer: "Sarah Miller", email: "sarah@example.com", date: "Jun 20, 2026", total: "€245.00", status: "Shipped" as OrderStatus, items: 1 },
  { id: "ORD-8922", customer: "David Kim", email: "david@example.com", date: "Jun 19, 2026", total: "€520.00", status: "Delivered" as OrderStatus, items: 1 },
  { id: "ORD-8921", customer: "Emma Wilson", email: "emma@example.com", date: "Jun 18, 2026", total: "€1,200.00", status: "Cancelled" as OrderStatus, items: 3 },
  { id: "ORD-8920", customer: "James Lee", email: "james@example.com", date: "Jun 18, 2026", total: "€265.00", status: "Delivered" as OrderStatus, items: 1 },
  { id: "ORD-8919", customer: "Maria Garcia", email: "maria@example.com", date: "Jun 17, 2026", total: "€410.00", status: "Shipped" as OrderStatus, items: 1 },
];

export default function Orders() {
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = initialOrders.filter((order) => {
    const matchesFilter = filter === "All" || order.status === filter;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-white mb-2">
            Orders
          </h1>
          <p className="text-xs text-neutral-400 uppercase tracking-widest">
            Manage and process customer orders.
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-brand-sky transition-colors text-white placeholder:text-neutral-600"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
          <Filter className="w-4 h-4 text-neutral-500 mr-2 shrink-0" />
          {(["All", "Pending", "Shipped", "Delivered", "Cancelled"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded text-[9px] uppercase tracking-widest font-bold whitespace-nowrap transition-colors ${
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

      {/* Orders Table */}
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 text-xs uppercase tracking-widest">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={order.id} 
                    className="border-b border-neutral-800 hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-bold text-white tracking-widest">{order.id}</span>
                      <div className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">{order.items} Item(s)</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-white mb-1">{order.customer}</div>
                      <div className="text-[9px] text-neutral-500 uppercase tracking-widest">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 text-[10px] text-neutral-400 uppercase tracking-widest">
                      {order.date}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-brand-sky text-glow-sky">
                      {order.total}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 bg-black border border-neutral-800 rounded hover:text-brand-sky hover:border-brand-sky/50 transition-colors" title="View Details">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {order.status === "Pending" && (
                          <button className="p-1.5 bg-black border border-neutral-800 rounded hover:text-brand-sky hover:border-brand-sky/50 transition-colors" title="Mark as Shipped">
                            <Truck className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-neutral-500">
          <div>Showing {filteredOrders.length} results</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-black border border-neutral-800 rounded hover:text-white transition-colors disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 bg-black border border-neutral-800 rounded hover:text-white transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
