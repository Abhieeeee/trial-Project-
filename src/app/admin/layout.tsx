"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If we are on the login page, don't show the sidebar/navbar shell
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", href: "#", icon: Users },
    { name: "Settings", href: "#", icon: Settings },
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-neutral-900 transform transition-transform duration-300 md:translate-x-0 md:static md:w-64 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-20 flex items-center px-8 border-b border-neutral-900 justify-between">
          <Link href="/admin/dashboard" className="text-sm font-bold tracking-[0.3em] uppercase font-display select-none text-white">
            AURA<span className="text-brand-sky">.</span>ADMIN
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
                    ? "bg-white/10 text-brand-sky border border-white/5" 
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-neutral-900">
          <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-brand-sky/20 flex items-center justify-center border border-brand-sky/30">
              <span className="text-brand-sky font-bold text-xs">EL</span>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold">Émile L.</div>
              <div className="text-[8px] uppercase tracking-widest text-neutral-500">Super Admin</div>
            </div>
          </div>
          <Link
            href="/admin/login"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[10px] uppercase tracking-[0.15em] font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-6 md:px-12 bg-black/50 backdrop-blur-md border-b border-neutral-900 sticky top-0 z-30">
          <button 
            className="md:hidden text-neutral-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-500">Overview Panel</h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] uppercase tracking-widest font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              System Online
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
