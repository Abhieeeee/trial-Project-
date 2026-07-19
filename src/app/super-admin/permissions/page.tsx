"use client";

import { useState } from "react";
import { Check, Save, ShieldCheck, X, ShieldAlert } from "lucide-react";
import { rolePermissions as defaultPermissions } from "@/lib/admin";

export default function SuperAdminPermissionsPage() {
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-red-500 font-display">Super Admin only</p>
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-white">Roles & Permissions</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.12em] text-neutral-400">
            Control the exact operational and elevated actions available to each staff role.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-black hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving Rules..." : saved ? "Permissions Saved" : "Save Permissions"}
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-[9px] uppercase tracking-[0.16em] text-neutral-500 font-bold">Operations Admin</p>
          <p className="mt-2 text-xl font-bold text-white">5 active zones</p>
          <p className="mt-2 text-[10px] text-neutral-400">No finance, staff, or system authority.</p>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-5">
          <p className="text-[9px] uppercase tracking-[0.16em] text-red-400 font-bold">Super Admin</p>
          <p className="mt-2 text-xl font-bold text-white">All privileges active</p>
          <p className="mt-2 text-[10px] text-neutral-400">Full store, finance, staff, security, and system authority.</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
        <div className="grid min-w-[760px] grid-cols-[1fr_1.4fr_1.4fr] border-b border-neutral-800 bg-black/50 px-5 py-4 text-[8px] font-bold uppercase tracking-[0.16em] text-neutral-500">
          <span>Control area</span>
          <span>Operations Admin</span>
          <span>Super Admin Privileges</span>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            {permissions.map((permission) => (
              <div key={permission.area} className="grid grid-cols-[1fr_1.4fr_1.4fr] items-center border-b border-neutral-800 px-5 py-4 last:border-0 hover:bg-white/[0.01] transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-white">{permission.area}</span>
                <span className={`flex items-center gap-2 text-[10px] ${permission.admin === "No access" ? "text-red-400 font-bold" : "text-neutral-300"}`}>
                  {permission.admin === "No access" ? <X className="h-3.5 w-3.5 text-red-500" /> : <Check className="h-3.5 w-3.5 text-emerald-400" />}
                  {permission.admin}
                </span>
                <span className="flex items-center gap-2 text-[10px] text-red-400 font-bold">
                  <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
                  {permission.superAdmin}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
