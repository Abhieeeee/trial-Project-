"use client";

import { useState, useEffect } from "react";
import { ArrowDownRight, ArrowUpRight, CreditCard, Download, ReceiptText, WalletCards } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SuperAdminSalesPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchSalesData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("total, created_at, status, items")
      .neq("status", "Cancelled");

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  // Compute stats
  const grossSales = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const taxCollected = Math.round(grossSales * 0.20); // 20% VAT representation
  const netSales = grossSales - taxCollected;
  const nextPayout = Math.round(netSales * 0.4); // 40% payout ratio representation

  // Performance chart (last 7 days)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const map: Record<string, number> = {};
  orders.forEach((o) => {
    const day = days[new Date(o.created_at).getDay()];
    map[day] = (map[day] ?? 0) + Number(o.total || 0);
  });

  const maxVal = Math.max(...days.map(d => map[d] ?? 0), 1);
  const weeklySales = days.map((d) => {
    const val = map[d] ?? 0;
    const ratio = Math.round((val / maxVal) * 100);
    return {
      day: d,
      value: ratio,
      amount: val > 0 ? `EUR ${(val / 1000).toFixed(1)}K` : "EUR 0.0K",
    };
  });

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-red-500 font-display">Restricted financial area</p>
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-white">Sales & Finance</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.12em] text-neutral-400">
            Revenue, payments, payouts, taxes, and live financial performance.
          </p>
        </div>
        <button
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders));
            const downloadAnchor = document.createElement("a");
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "financial_report.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="inline-flex items-center gap-2 rounded-md border border-neutral-700 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-white hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          Export finance report
        </button>
      </div>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Gross sales", value: `EUR ${grossSales.toLocaleString()}`, note: "+12.5%", icon: WalletCards, positive: true },
          { label: "Net sales (VAT Excl.)", value: `EUR ${netSales.toLocaleString()}`, note: "+10.2%", icon: ReceiptText, positive: true },
          { label: "Tax Collected (20%)", value: `EUR ${taxCollected.toLocaleString()}`, note: "VAT Standard", icon: ArrowDownRight, positive: false },
          { label: "Next payout", value: `EUR ${nextPayout.toLocaleString()}`, note: "Auto-clearing", icon: CreditCard, positive: true },
        ].map((item) => (
          <div key={item.label} className="glass-panel-glow rounded-lg p-5">
            <item.icon className="mb-5 h-4 w-4 text-red-500" />
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-500">{item.label}</p>
            <p className="mt-2 text-xl font-bold text-white">{loading ? "..." : item.value}</p>
            <p className={`mt-2 flex items-center gap-1 text-[9px] font-bold uppercase ${item.positive ? "text-emerald-400" : "text-amber-400"}`}>
              {item.note}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Sales performance</h2>
            <span className="text-[9px] uppercase tracking-[0.14em] text-neutral-500">Last 7 days</span>
          </div>
          <div className="flex h-72 items-end gap-3">
            {weeklySales.map((entry) => (
              <div key={entry.day} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-3">
                <div className="relative flex flex-1 items-end overflow-hidden rounded-t-sm border border-neutral-800 bg-black">
                  <div className="w-full border-t border-red-500 bg-red-500/10" style={{ height: `${entry.value}%` }} />
                  <span className="absolute inset-x-0 top-3 hidden text-center text-[8px] font-bold lg:block text-neutral-400">
                    {entry.amount}
                  </span>
                </div>
                <span className="text-center text-[8px] font-bold uppercase text-neutral-500">{entry.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white">Revenue breakdown</h2>
          {[
            ["Product revenue", `EUR ${(grossSales * 0.93).toFixed(0)}`, "93%"],
            ["Shipping fee revenue", `EUR ${(grossSales * 0.07).toFixed(0)}`, "7%"],
          ].map(([label, value, ratio]) => (
            <div key={label} className="border-b border-neutral-800 py-4 last:border-0">
              <div className="flex justify-between gap-4 text-[10px]">
                <span className="text-neutral-400 uppercase tracking-wider">{label}</span>
                <span className="font-bold text-white">{value}</span>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-black">
                <div className="h-full bg-red-500" style={{ width: ratio }} />
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
