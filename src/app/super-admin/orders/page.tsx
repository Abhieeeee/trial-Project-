import { Download, FileText, RotateCcw, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/admin/Badge";
import { orderRows } from "@/lib/catalog";

export default function SuperAdminOrdersPage() {
  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-brand-sky">Elevated order control</p>
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em]">All Orders</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.12em] text-neutral-400">Fulfillment plus high-level refunds, exports, cancellation, and payment review.</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-md border border-neutral-700 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] hover:border-brand-sky">
          <Download className="h-3.5 w-3.5" />Export orders
        </button>
      </div>

      <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[["All orders", "8,924"], ["Open", "142"], ["Refund requests", "9"], ["Payment review", "4"]].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-500">{label}</p>
            <p className="mt-3 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="border-b border-neutral-800 bg-black/50 text-[8px] font-bold uppercase tracking-[0.16em] text-neutral-500">
              <tr><th className="px-5 py-4">Order</th><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Total</th><th className="px-5 py-4">Elevated actions</th></tr>
            </thead>
            <tbody>
              {orderRows.map((order) => (
                <tr key={order.id} className="border-b border-neutral-800 last:border-0">
                  <td className="px-5 py-4 text-[10px] font-bold tracking-[0.12em]">{order.id}</td>
                  <td className="px-5 py-4"><p className="text-xs">{order.customer}</p><p className="mt-1 text-[9px] text-neutral-500">{order.email}</p></td>
                  <td className="px-5 py-4 text-[9px] text-neutral-400">{order.date}</td>
                  <td className="px-5 py-4"><Badge status={order.status as "Pending" | "Shipped" | "Delivered" | "Cancelled"} /></td>
                  <td className="px-5 py-4 text-xs font-bold text-brand-sky">{order.total}</td>
                  <td className="px-5 py-4"><div className="flex gap-2">
                    <button type="button" title="Invoice" className="rounded-md border border-neutral-700 p-2 hover:text-brand-sky"><FileText className="h-3.5 w-3.5" /></button>
                    <button type="button" title="Refund" className="rounded-md border border-amber-500/20 p-2 text-amber-300 hover:bg-amber-500/10"><RotateCcw className="h-3.5 w-3.5" /></button>
                    <button type="button" title="Review payment" className="rounded-md border border-red-500/20 p-2 text-red-400 hover:bg-red-500/10"><ShieldAlert className="h-3.5 w-3.5" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

