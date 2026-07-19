"use client";

import { useState, useEffect } from "react";
import { Download, FileText, RotateCcw, ShieldAlert, Check } from "lucide-react";
import { Badge } from "@/components/admin/Badge";
import { createClient } from "@/lib/supabase/client";
import type { Order, OrderStatus } from "@/types/database";

export default function SuperAdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Stats calculation
  const totalCount = orders.length;
  const refundRequests = orders.filter(o => o.status === "Cancelled").length; // representing refund/cancelled orders
  const pendingCount = orders.filter(o => o.status === "Pending").length;
  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-red-500">Elevated order control</p>
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-white">All Orders</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.12em] text-neutral-400">
            Fulfillment plus high-level refunds, exports, cancellation, and payment reviews.
          </p>
        </div>
        <button
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders));
            const downloadAnchor = document.createElement("a");
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "all_orders.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="inline-flex items-center gap-2 rounded-md border border-neutral-700 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer text-white"
        >
          <Download className="h-3.5 w-3.5" />
          Export orders
        </button>
      </div>

      <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          ["All orders", totalCount.toString()],
          ["Awaiting Dispatch", pendingCount.toString()],
          ["Refund/Cancelled", refundRequests.toString()],
          ["Gross Revenue", `EUR ${totalRevenue.toLocaleString()}`],
        ].map(([label, value]) => (
          <div key={label} className="glass-panel-glow rounded-lg p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-500">{label}</p>
            <p className="mt-3 text-2xl font-bold text-white">{loading ? "..." : value}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="border-b border-neutral-800 bg-black/50 text-[8px] font-bold uppercase tracking-[0.16em] text-neutral-500">
              <tr>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Elevated actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-xs uppercase tracking-widest text-neutral-500">
                    Loading orders database...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-xs uppercase tracking-widest text-neutral-500">
                    No orders exist in the database.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-800 last:border-0 hover:bg-white/[0.01] transition-colors">
                    <td className="px-5 py-4 text-[10px] font-bold tracking-[0.12em] text-white">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-white">{order.customer_name || "Guest Customer"}</p>
                      <p className="mt-1 text-[9px] text-neutral-500">{order.customer_email}</p>
                    </td>
                    <td className="px-5 py-4 text-[9px] text-neutral-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <Badge status={order.status} />
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-red-400">
                      EUR {Number(order.total || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {order.status === "Pending" && (
                          <button
                            onClick={() => updateStatus(order.id, "Shipped")}
                            disabled={updatingId === order.id}
                            type="button"
                            title="Mark as Shipped"
                            className="rounded-md border border-neutral-700 p-2 hover:text-red-500 hover:border-red-500/50 cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {order.status !== "Cancelled" && (
                          <button
                            onClick={() => updateStatus(order.id, "Cancelled")}
                            disabled={updatingId === order.id}
                            type="button"
                            title="Refund & Cancel"
                            className="rounded-md border border-amber-500/20 p-2 text-amber-300 hover:bg-amber-500/10 cursor-pointer"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          title="Flag Payment Review"
                          onClick={() => alert(`Review flagged for transaction verification on order ${order.id}`)}
                          className="rounded-md border border-red-500/20 p-2 text-red-400 hover:bg-red-500/10 cursor-pointer"
                        >
                          <ShieldAlert className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
