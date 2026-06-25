"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Menu, X, ShieldAlert } from "lucide-react";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "#", icon: ShoppingBag },
    { name: "Staff & Users", href: "#", icon: Users },
    { name: "System Settings", href: "/super-admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-red-900/30 transform transition-transform duration-300 md:translate-x-0 md:static flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-20 flex items-center px-8 border-b border-red-900/30 justify-between">
          <Link href="/super-admin/dashboard" className="text-sm font-bold tracking-[0.3em] uppercase font-display select-none text-white">
            AURA<span className="text-red-500">.</span>SUPER
          </Link>
          <button className="md:hidden text-neutral-500" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[10px] uppercase tracking-[0.15em] font-semibold transition-colors ${
                  isActive 
                    ? "bg-red-500/10 text-red-500 border border-red-500/20" 
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-red-900/30">
          <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-red-500/5 border border-red-500/10">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30 text-red-500">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold">Émile L.</div>
              <div className="text-[8px] uppercase tracking-widest text-red-500">Super Admin</div>
            </div>
          </div>
          <Link
            href="/admin/login"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[10px] uppercase tracking-[0.15em] font-semibold text-neutral-500 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-6 md:px-12 bg-black/50 backdrop-blur-md border-b border-red-900/30 sticky top-0 z-30">
          <button 
            className="md:hidden text-neutral-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-red-500">Super Admin Access</h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] uppercase tracking-widest font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Root Access
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
