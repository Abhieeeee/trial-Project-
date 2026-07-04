"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, LogOut, Menu, ShieldCheck, X } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminShellProps {
  children: ReactNode;
  navItems: NavItem[];
  homeHref: string;
  brandLabel: string;
  roleLabel: string;
  personName: string;
  initials: string;
  accessLabel: string;
}

export function AdminShell({
  children,
  navItems,
  homeHref,
  brandLabel,
  roleLabel,
  personName,
  initials,
  accessLabel,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleSignOut() {
    try {
      await createClient().auth.signOut();
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-neutral-950 text-white">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/80 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-neutral-900 bg-black transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between border-b border-neutral-900 px-7">
          <Link href={homeHref} className="text-sm font-bold uppercase tracking-[0.25em]">
            AURA<span className="text-brand-sky">.</span>{brandLabel}
          </Link>
          <button type="button" aria-label="Close navigation" className="text-neutral-500 md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-neutral-900 px-5 py-5">
          <div className="flex items-center gap-3 rounded-lg border border-brand-sky/20 bg-brand-sky/5 px-4 py-3">
            <ShieldCheck className="h-4 w-4 text-brand-sky" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand-sky">{roleLabel}</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-neutral-500">{accessLabel}</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6" aria-label={`${roleLabel} navigation`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex min-h-11 items-center gap-3 rounded-md border px-4 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  isActive
                    ? "border-brand-sky/20 bg-brand-sky/10 text-brand-sky"
                    : "border-transparent text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1">{item.name}</span>
                {isActive && <ChevronRight className="h-3.5 w-3.5" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-neutral-900 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-sky/30 bg-brand-sky/10 text-xs font-bold text-brand-sky">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em]">{personName}</p>
              <p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-neutral-500">{roleLabel}</p>
            </div>
          </div>
          <button type="button" onClick={handleSignOut} className="flex min-h-11 w-full items-center gap-3 rounded-md px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-red-400 transition-colors hover:bg-red-500/10">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-neutral-900 bg-black/75 px-5 backdrop-blur-xl md:px-10">
          <button type="button" aria-label="Open navigation" className="text-neutral-400 transition-colors hover:text-white md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:block">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">{roleLabel} workspace</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">{accessLabel}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            System online
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

