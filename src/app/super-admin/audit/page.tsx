import { Download, Filter, Search, ShieldCheck } from "lucide-react";

import { auditEvents } from "@/lib/admin";

export default function SuperAdminAuditPage() {
  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-brand-sky">Security record</p>
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em]">Audit Log</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.12em] text-neutral-400">Review every privileged staff, order, catalog, financial, and system event.</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-md border border-neutral-700 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] hover:border-brand-sky"><Download className="h-3.5 w-3.5" />Export audit log</button>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-lg border border-neutral-800 bg-neutral-900 p-4 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search audit events</span>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input type="search" placeholder="Search actor, event, or target..." className="w-full rounded-md border border-neutral-800 bg-black py-2.5 pl-10 pr-4 text-[10px] uppercase tracking-[0.12em] outline-none focus:border-brand-sky" />
        </label>
        <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md border border-neutral-700 px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em]"><Filter className="h-3.5 w-3.5" />Filter events</button>
      </div>

      <section className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="border-b border-neutral-800 bg-black/50 text-[8px] font-bold uppercase tracking-[0.16em] text-neutral-500"><tr><th className="px-5 py-4">Event ID</th><th className="px-5 py-4">Actor</th><th className="px-5 py-4">Action</th><th className="px-5 py-4">Target</th><th className="px-5 py-4">Timestamp</th></tr></thead>
            <tbody>
              {auditEvents.map((event) => (
                <tr key={event.id} className="border-b border-neutral-800 last:border-0">
                  <td className="px-5 py-4 text-[9px] font-bold text-brand-sky">{event.id}</td>
                  <td className="px-5 py-4"><span className="inline-flex items-center gap-2 text-[10px] font-bold"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />{event.actor}</span></td>
                  <td className="px-5 py-4 text-[10px] text-neutral-300">{event.event}</td>
                  <td className="px-5 py-4 text-[9px] text-neutral-400">{event.target}</td>
                  <td className="px-5 py-4 text-[9px] text-neutral-500">{event.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

