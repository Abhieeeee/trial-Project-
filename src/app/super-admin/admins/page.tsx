import { MoreHorizontal, Plus, ShieldCheck, UserCog } from "lucide-react";

import { staffMembers } from "@/lib/admin";

export default function SuperAdminStaffPage() {
  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-brand-sky">Super Admin only</p>
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em]">Staff Management</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.12em] text-neutral-400">Invite admins, change roles, suspend access, and inspect staff activity.</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-black hover:bg-brand-sky"><Plus className="h-3.5 w-3.5" />Invite admin</button>
      </div>
      <section className="grid gap-4">
        {staffMembers.map((member) => (
          <div key={member.email} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-5 md:grid-cols-[auto_1.5fr_1fr_1fr_auto]">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-sky/20 bg-brand-sky/10"><UserCog className="h-5 w-5 text-brand-sky" /></div>
            <div><p className="text-[10px] font-bold uppercase tracking-[0.14em]">{member.name}</p><p className="mt-1 text-[9px] text-neutral-500">{member.email}</p></div>
            <div className="hidden md:block"><p className="text-[8px] uppercase tracking-[0.14em] text-neutral-500">Role</p><p className="mt-1 text-[10px] text-white">{member.role}</p></div>
            <div className="hidden md:block"><p className="text-[8px] uppercase tracking-[0.14em] text-neutral-500">Last activity</p><p className="mt-1 text-[10px] text-white">{member.lastSeen}</p></div>
            <div className="flex items-center gap-3">
              <span className={`hidden items-center gap-1 text-[8px] font-bold uppercase sm:flex ${member.status === "Active" ? "text-emerald-400" : "text-amber-300"}`}><ShieldCheck className="h-3.5 w-3.5" />{member.status}</span>
              <button type="button" title="Staff actions" className="rounded-md border border-neutral-700 p-2 hover:border-brand-sky"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

