"use client";

import { useState } from "react";
import { Check, Save, ShieldCheck, X } from "lucide-react";

import { rolePermissions } from "@/lib/admin";

export default function SuperAdminPermissionsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-brand-sky">Super Admin only</p>
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em]">Roles & Permissions</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.12em] text-neutral-400">Control the exact operational and elevated actions available to each staff role.</p>
        </div>
        <button type="button" onClick={() => setSaved(true)} className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-black hover:bg-brand-sky"><Save className="h-3.5 w-3.5" />{saved ? "Permissions saved" : "Save permissions"}</button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5"><p className="text-[9px] uppercase tracking-[0.16em] text-neutral-500">Operations Admin</p><p className="mt-2 text-xl font-bold">5 operational areas</p><p className="mt-2 text-[10px] text-neutral-400">No finance, staff, or system authority.</p></div>
        <div className="rounded-lg border border-brand-sky/20 bg-brand-sky/5 p-5"><p className="text-[9px] uppercase tracking-[0.16em] text-brand-sky">Super Admin</p><p className="mt-2 text-xl font-bold">All permissions</p><p className="mt-2 text-[10px] text-neutral-400">Full store, finance, staff, security, and system authority.</p></div>
      </div>

      <section className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
        <div className="grid min-w-[760px] grid-cols-[1fr_1.4fr_1.4fr] border-b border-neutral-800 bg-black/50 px-5 py-4 text-[8px] font-bold uppercase tracking-[0.16em] text-neutral-500">
          <span>Control area</span><span>Operations Admin</span><span>Super Admin</span>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            {rolePermissions.map((permission) => (
              <div key={permission.area} className="grid grid-cols-[1fr_1.4fr_1.4fr] items-center border-b border-neutral-800 px-5 py-4 last:border-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.13em]">{permission.area}</span>
                <span className={`flex items-center gap-2 text-[10px] ${permission.admin === "No access" ? "text-red-400" : "text-neutral-300"}`}>{permission.admin === "No access" ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5 text-emerald-400" />}{permission.admin}</span>
                <span className="flex items-center gap-2 text-[10px] text-brand-sky"><ShieldCheck className="h-3.5 w-3.5" />{permission.superAdmin}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
