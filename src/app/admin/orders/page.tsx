"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Search, Eye, Truck, RefreshCw } from "lucide-react";
import { Badge } from "@/components/admin/Badge";

type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

const initialOrders = [
  { id: "ORD-8924", customer: "Alex Chen", email: "alex@example.com", date: "Jun 25, 2026", total: "€680.00", status: "Pending" as OrderStatus, items: 1, product: "Moto Jacket" },
  { id: "ORD-8923", customer: "Sarah Miller", email: "sarah@example.com", date: "Jun 25, 2026", total: "€245.00", status: "Shipped" as OrderStatus, items: 1, product: "Essential Hoodie" },
  { id: "ORD-8922", customer: "David Kim", email: "david@example.com", date: "Jun 24, 2026", total: "€520.00", status: "Delivered" as OrderStatus, items: 1, product: "Tech Shell Jacket" },
  { id: "ORD-8921", customer: "Emma Wilson", email: "emma@example.com", date: "Jun 23, 2026", total: "€1,200.00", status: "Cancelled" as OrderStatus, items: 3, product: "Multiple items" },
  { id: "ORD-8920", customer: "James Lee", email: "james@example.com", date: "Jun 22, 2026", total: "€265.00", status: "Delivered" as OrderStatus, items: 1, product: "Shadow Hoodie II" },
  { id: "ORD-8919", customer: "Maria Garcia", email: "maria@example.com", date: "Jun 21, 2026", total: "€410.00", status: "Shipped" as OrderStatus, items: 1, product: "Street Runner" },
];

const statuses: Array<"All" | OrderStatus> = ["All", "Pending", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");
  const [search, setSearch] = useState("");

  const filtered = initialOrders.filter((o) => {
    const matchFilter = filter === "All" || o.status === filter;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    All: initialOrders.length,
    Pending: initialOrders.filter(o => o.status === "Pending").length,
    Shipped: initialOrders.filter(o => o.status === "Shipped").length,
    Delivered: initialOrders.filter(o => o.status === "Delivered").length,
    Cancelled: initialOrders.filter(o => o.status === "Cancelled").length,
  };

  return (
    <div className="pb-16 space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-bold mb-1">Admin Portal</p>
          <h1 className="text-2xl font-display font-bold uppercase tracking-widest text-white">Orders</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] uppercase tracking-widest font-bold text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors self-start sm:self-auto">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* ── Status Summary Tabs ── */}
      <div className="grid grid-cols-5 gap-3">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`p-3 rounded-xl border text-center transition-all ${
              filter === s
                ? "bg-white/10 border-white/10 text-white"
                : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300"
            }`}
          >
            <div className="text-lg font-display font-bold">{counts[s]}</div>
            <div className="text-[9px] uppercase tracking-widest font-bold mt-0.5">{s}</div>
          </button>
        ))}
      </div>

      {/* ── Search + Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer name..."
            className="w-full bg-black border border-neutral-800 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-brand-sky transition-colors text-white placeholder:text-neutral-700"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-neutral-500" />
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-[9px] uppercase tracking-widest font-bold transition-colors ${
                filter === s ? "bg-brand-sky/20 text-brand-sky border border-brand-sky/30" : "bg-black border border-neutral-800 text-neutral-500 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Orders Table ── */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 border-b border-neutral-800">
                <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Order</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Customer</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Product</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Date</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Status</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-neutral-500 font-bold text-right">Total</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-neutral-500 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-neutral-500 text-xs uppercase tracking-widest">
                    No orders match your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((o, idx) => (
                  <motion.tr
                    key={o.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-b border-neutral-800 hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="text-[11px] font-bold text-white tracking-widest">{o.id}</div>
                      <div className="text-[9px] text-neutral-500 uppercase tracking-widest mt-0.5">{o.items} item(s)</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-semibold text-white">{o.customer}</div>
                      <div className="text-[9px] text-neutral-500 tracking-widest mt-0.5">{o.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest">{o.product}</span>
                    </td>
                    <td className="px-6 py-4 text-[10px] text-neutral-400 uppercase tracking-widest">{o.date}</td>
                    <td className="px-6 py-4"><Badge status={o.status} /></td>
                    <td className="px-6 py-4 text-xs font-bold text-brand-sky text-right">{o.total}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-black border border-neutral-800 rounded-lg hover:text-brand-sky hover:border-brand-sky/40 transition-colors" title="View Details">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {o.status === "Pending" && (
                          <button className="p-2 bg-black border border-neutral-800 rounded-lg hover:text-green-500 hover:border-green-500/40 transition-colors" title="Mark Shipped">
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
        <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">{filtered.length} result(s)</span>
          <div className="flex gap-2">
            <button disabled className="px-4 py-2 bg-black border border-neutral-800 rounded-lg text-[10px] uppercase tracking-widest font-bold text-neutral-600 disabled:cursor-not-allowed">Prev</button>
            <button className="px-4 py-2 bg-black border border-neutral-800 rounded-lg text-[10px] uppercase tracking-widest font-bold text-neutral-400 hover:text-white transition-colors">Next</button>
          </div>
        </div>
      </div>

    </div>
  );
}
