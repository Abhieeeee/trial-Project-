"use client";

import { useState } from "react";
import { BellRing, Database, Globe2, Save, ShieldAlert, Store } from "lucide-react";

const settings = [
  { id: "maintenance", label: "Maintenance mode", detail: "Temporarily block storefront checkout.", enabled: false, icon: Store },
  { id: "two-factor", label: "Require staff 2FA", detail: "Enforce two-factor authentication for every staff account.", enabled: true, icon: ShieldAlert },
  { id: "alerts", label: "Critical system alerts", detail: "Send finance and infrastructure alerts to Super Admins.", enabled: true, icon: BellRing },
  { id: "backups", label: "Automated backups", detail: "Run encrypted daily database backups.", enabled: true, icon: Database },
  { id: "international", label: "International storefront", detail: "Enable multi-currency and locale routing.", enabled: true, icon: Globe2 },
];

export default function SuperAdminSettingsPage() {
  const [values, setValues] = useState(() => Object.fromEntries(settings.map((setting) => [setting.id, setting.enabled])));
  const [saved, setSaved] = useState(false);

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-brand-sky">Super Admin only</p>
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em]">System Settings</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.12em] text-neutral-400">High-impact commerce, security, infrastructure, and international configuration.</p>
        </div>
        <button type="button" onClick={() => setSaved(true)} className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-black hover:bg-brand-sky"><Save className="h-3.5 w-3.5" />{saved ? "Settings saved" : "Save settings"}</button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
          <div className="border-b border-neutral-800 p-5"><h2 className="text-xs font-bold uppercase tracking-[0.18em]">Platform controls</h2></div>
          {settings.map((setting) => (
            <div key={setting.id} className="flex items-center gap-4 border-b border-neutral-800 p-5 last:border-0">
              <setting.icon className="h-5 w-5 shrink-0 text-brand-sky" />
              <div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.13em]">{setting.label}</p><p className="mt-2 text-[10px] leading-relaxed text-neutral-500">{setting.detail}</p></div>
              <button
                type="button"
                role="switch"
                aria-checked={Boolean(values[setting.id])}
                aria-label={setting.label}
                onClick={() => { setValues((current) => ({ ...current, [setting.id]: !current[setting.id] })); setSaved(false); }}
                className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors ${values[setting.id] ? "border-brand-sky bg-brand-sky" : "border-neutral-700 bg-black"}`}
              >
                <span className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white transition-transform ${values[setting.id] ? "translate-x-5" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em]">Store identity</h2>
            <label className="mt-5 block text-[9px] font-bold uppercase tracking-[0.14em] text-neutral-500">Store name<input defaultValue="AURA STREET" className="mt-2 w-full rounded-md border border-neutral-800 bg-black px-4 py-3 text-xs text-white outline-none focus:border-brand-sky" /></label>
            <label className="mt-4 block text-[9px] font-bold uppercase tracking-[0.14em] text-neutral-500">Support email<input defaultValue="support@aurastreet.com" className="mt-2 w-full rounded-md border border-neutral-800 bg-black px-4 py-3 text-xs text-white outline-none focus:border-brand-sky" /></label>
            <label className="mt-4 block text-[9px] font-bold uppercase tracking-[0.14em] text-neutral-500">Base currency<select defaultValue="EUR" className="mt-2 w-full rounded-md border border-neutral-800 bg-black px-4 py-3 text-xs text-white outline-none focus:border-brand-sky"><option>EUR</option><option>USD</option><option>GBP</option></select></label>
          </div>
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">Danger zone</h2>
            <p className="mt-3 text-[10px] leading-relaxed text-neutral-400">These controls affect all customers, staff, and active orders.</p>
            <button type="button" className="mt-5 rounded-md border border-red-500/30 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-red-400 hover:bg-red-500/10">Lock all staff sessions</button>
          </div>
        </section>
      </div>
    </div>
  );
}
