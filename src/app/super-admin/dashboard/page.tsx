import Link from "next/link";
import { Activity, ArrowUpRight, Banknote, KeyRound, Server, ShieldCheck, UserCog, WalletCards } from "lucide-react";

import { auditEvents, staffMembers, weeklySales } from "@/lib/admin";

const executiveMetrics = [
  { label: "Gross revenue", value: "EUR 124.5K", change: "+12.5%", icon: WalletCards },
  { label: "Net revenue", value: "EUR 98.7K", change: "+10.2%", icon: Banknote },
  { label: "Refund exposure", value: "EUR 3.4K", change: "2.7%", icon: Activity },
  { label: "Active staff", value: "4", change: "1 invited", icon: UserCog },
];

export default function SuperAdminDashboardPage() {
  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-brand-sky">Full authority workspace</p>
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-white">Super Admin Command Center</h1>
          <p className="mt-3 max-w-3xl text-xs uppercase tracking-[0.12em] text-neutral-400">
            Complete visibility across finance, commerce, staff access, security, and store infrastructure.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md border border-brand-sky/20 bg-brand-sky/5 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-brand-sky">
          <ShieldCheck className="h-4 w-4" />All permissions active
        </div>
      </div>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {executiveMetrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-500">{metric.label}</p>
              <metric.icon className="h-4 w-4 text-brand-sky" />
            </div>
            <p className="text-2xl font-bold">{metric.value}</p>
            <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-400">{metric.change}</p>
          </div>
        ))}
      </section>

      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <div className="mb-7 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em]">Revenue control</h2>
              <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-neutral-500">Gross, tax, discounts, and refund exposure</p>
            </div>
            <Link href="/super-admin/sales" className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand-sky">Open finance</Link>
          </div>
          <div className="flex h-64 items-end gap-3">
            {weeklySales.map((entry) => (
              <div key={entry.day} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-3">
                <div className="flex flex-1 items-end overflow-hidden rounded-t-sm border border-neutral-800 bg-black">
                  <div className="w-full border-t border-brand-sky/70 bg-brand-sky/30" style={{ height: `${entry.value}%` }} />
                </div>
                <span className="text-center text-[8px] font-bold uppercase text-neutral-500">{entry.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.18em]">System health</h2>
          {[
            ["Storefront", "Operational", "99.99%"],
            ["Checkout API", "Operational", "128ms"],
            ["Database", "Healthy", "34ms"],
            ["Cache", "Healthy", "8ms"],
          ].map(([service, status, metric]) => (
            <div key={service} className="flex items-center gap-3 border-b border-neutral-800 py-4 last:border-0">
              <Server className="h-4 w-4 text-emerald-400" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em]">{service}</p>
                <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-emerald-400">{status}</p>
              </div>
              <span className="text-[9px] text-neutral-500">{metric}</span>
            </div>
          ))}
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em]">Staff access</h2>
            <Link href="/super-admin/admins" className="text-[9px] font-bold uppercase text-brand-sky">Manage</Link>
          </div>
          {staffMembers.slice(0, 3).map((member) => (
            <div key={member.email} className="flex items-center gap-4 border-b border-neutral-800 py-4 last:border-0">
              <KeyRound className="h-4 w-4 text-brand-sky" />
              <div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.12em]">{member.name}</p><p className="mt-1 text-[9px] text-neutral-500">{member.role}</p></div>
              <span className="text-[8px] uppercase text-emerald-400">{member.status}</span>
            </div>
          ))}
        </section>

        <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em]">Security activity</h2>
            <Link href="/super-admin/audit" className="text-[9px] font-bold uppercase text-brand-sky">Full audit</Link>
          </div>
          {auditEvents.slice(0, 3).map((event) => (
            <div key={event.id} className="flex items-start gap-4 border-b border-neutral-800 py-4 last:border-0">
              <ArrowUpRight className="mt-0.5 h-4 w-4 text-brand-sky" />
              <div><p className="text-[10px] font-semibold text-white">{event.event}</p><p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-neutral-500">{event.actor} / {event.time}</p></div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
