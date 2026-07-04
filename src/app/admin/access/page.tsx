import { Check, LockKeyhole, ShieldCheck, X } from "lucide-react";

import { rolePermissions } from "@/lib/admin";

export default function AdminAccessPage() {
  return (
    <div className="pb-12">
      <div className="mb-8">
        <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-brand-sky">Read-only access profile</p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-white">My Permissions</h1>
        <p className="mt-3 max-w-2xl text-xs uppercase tracking-[0.12em] text-neutral-400">
          Admins can run daily store operations. High-risk financial, staff, and system controls remain restricted.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-brand-sky/20 bg-brand-sky/5 p-5">
          <ShieldCheck className="mb-4 h-5 w-5 text-brand-sky" />
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-500">Assigned role</p>
          <p className="mt-2 text-lg font-bold uppercase tracking-[0.1em]">Operations Admin</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
          <Check className="mb-4 h-5 w-5 text-emerald-400" />
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-500">Operational areas</p>
          <p className="mt-2 text-lg font-bold">5 enabled</p>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-5">
          <LockKeyhole className="mb-4 h-5 w-5 text-red-400" />
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-500">High-level controls</p>
          <p className="mt-2 text-lg font-bold">Restricted</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
        <div className="grid grid-cols-[1fr_1.4fr] border-b border-neutral-800 bg-black/50 px-5 py-4 text-[8px] font-bold uppercase tracking-[0.16em] text-neutral-500">
          <span>Area</span><span>Admin permission</span>
        </div>
        {rolePermissions.map((permission) => {
          const restricted = permission.admin === "No access";
          return (
            <div key={permission.area} className="grid grid-cols-[1fr_1.4fr] items-center border-b border-neutral-800 px-5 py-4 last:border-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white">{permission.area}</span>
              <span className={`flex items-center gap-2 text-[10px] ${restricted ? "text-red-400" : "text-neutral-300"}`}>
                {restricted ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5 text-emerald-400" />}
                {permission.admin}
              </span>
            </div>
          );
        })}
      </section>
    </div>
  );
}
