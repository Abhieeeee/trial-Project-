"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import { Badge } from "@/components/admin/Badge";

type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

const initialOrders = [
  { id: "ORD-8924", customer: "Alex Chen", date: "Jun 20, 2026", total: "€680.00", status: "Pending" as OrderStatus },
  { id: "ORD-8923", customer: "Sarah Miller", date: "Jun 20, 2026", total: "€245.00", status: "Shipped" as OrderStatus },
  { id: "ORD-8922", customer: "David Kim", date: "Jun 19, 2026", total: "€520.00", status: "Delivered" as OrderStatus },
  { id: "ORD-8921", customer: "Emma Wilson", date: "Jun 18, 2026", total: "€1,200.00", status: "Cancelled" as OrderStatus },
];

export default function UserOrders() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = initialOrders.filter((order) => {
    return order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
           order.customer.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-white mb-2">
          Order Queue
        </h1>
        <p className="text-xs text-neutral-400 uppercase tracking-widest">
          View-only access to customer orders.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-brand-sky transition-colors text-white"
          />
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/50 border-b border-neutral-800 text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, idx) => (
              <motion.tr 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={order.id} 
                className="border-b border-neutral-800 hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4 text-[11px] font-bold text-white tracking-widest">{order.id}</td>
                <td className="px-6 py-4 text-xs text-white">{order.customer}</td>
                <td className="px-6 py-4 text-[10px] text-neutral-400 uppercase tracking-widest">{order.date}</td>
                <td className="px-6 py-4"><Badge status={order.status} /></td>
                <td className="px-6 py-4 text-xs font-bold text-neutral-300">{order.total}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 bg-black border border-neutral-800 rounded hover:text-white transition-colors" title="View Detail">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
