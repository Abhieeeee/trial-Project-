import { ArrowDownRight, ArrowUpRight, CreditCard, Download, ReceiptText, WalletCards } from "lucide-react";

import { weeklySales } from "@/lib/admin";

export default function SuperAdminSalesPage() {
  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-brand-sky">Restricted financial area</p>
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em]">Sales & Finance</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.12em] text-neutral-400">Revenue, payments, payouts, taxes, discounts, and refund reporting.</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-md border border-neutral-700 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] hover:border-brand-sky">
          <Download className="h-3.5 w-3.5" />Export finance report
        </button>
      </div>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Gross sales", value: "EUR 124,500", note: "+12.5%", icon: WalletCards, positive: true },
          { label: "Net sales", value: "EUR 98,740", note: "+10.2%", icon: ReceiptText, positive: true },
          { label: "Refunds", value: "EUR 3,420", note: "+0.8%", icon: ArrowDownRight, positive: false },
          { label: "Next payout", value: "EUR 42,180", note: "Jul 08", icon: CreditCard, positive: true },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
            <item.icon className="mb-5 h-4 w-4 text-brand-sky" />
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-500">{item.label}</p>
            <p className="mt-2 text-xl font-bold">{item.value}</p>
            <p className={`mt-2 flex items-center gap-1 text-[9px] font-bold uppercase ${item.positive ? "text-emerald-400" : "text-red-400"}`}>
              {item.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{item.note}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em]">Sales performance</h2>
            <span className="text-[9px] uppercase tracking-[0.14em] text-neutral-500">Last 7 days</span>
          </div>
          <div className="flex h-72 items-end gap-3">
            {weeklySales.map((entry) => (
              <div key={entry.day} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-3">
                <div className="relative flex flex-1 items-end overflow-hidden rounded-t-sm border border-neutral-800 bg-black">
                  <div className="w-full border-t border-brand-sky/70 bg-brand-sky/30" style={{ height: `${entry.value}%` }} />
                  <span className="absolute inset-x-0 top-3 hidden text-center text-[8px] font-bold lg:block">{entry.amount}</span>
                </div>
                <span className="text-center text-[8px] font-bold uppercase text-neutral-500">{entry.day}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.18em]">Revenue breakdown</h2>
          {[
            ["Product revenue", "EUR 112,800", "90.6%"],
            ["Shipping", "EUR 8,140", "6.5%"],
            ["Tax collected", "EUR 18,720", "15.0%"],
            ["Discounts", "- EUR 7,230", "5.8%"],
            ["Refunds", "- EUR 3,420", "2.7%"],
          ].map(([label, value, ratio]) => (
            <div key={label} className="border-b border-neutral-800 py-4 last:border-0">
              <div className="flex justify-between gap-4 text-[10px]"><span className="text-neutral-400">{label}</span><span className="font-bold text-white">{value}</span></div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-black"><div className="h-full bg-brand-sky" style={{ width: ratio }} /></div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

