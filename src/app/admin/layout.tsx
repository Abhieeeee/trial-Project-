"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Warehouse,
  PackageSearch,
  UsersRound,
  Settings,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("name, role")
          .eq("id", user.id)
          .single();
        if (data) {
          setProfile({ name: data.name, role: data.role });
        }
      }
    }
    loadProfile();
  }, []);

  // If we are on the login page, don't show the sidebar/navbar shell
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  // Set all nav items
  const allNavItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Inventory", href: "/admin/inventory", icon: Warehouse },
    { name: "Products", href: "/admin/products", icon: PackageSearch },
    { name: "Customers", href: "/admin/customers", icon: UsersRound },
    { name: "Settings", href: "/admin/access", icon: Settings },
  ];

  // Filter items if role is staff
  const navItems = profile?.role === "staff"
    ? allNavItems.filter(item => ["Orders", "Inventory"].includes(item.name))
    : allNavItems;

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex overflow-hidden relative">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/70 border-r border-neutral-900/60 backdrop-blur-2xl transform transition-transform duration-300 md:translate-x-0 md:static md:w-64 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-8 border-b border-neutral-900/60 justify-between">
          <Link href="/admin/dashboard" className="text-xs font-bold tracking-[0.35em] uppercase font-display select-none text-white flex items-center gap-1.5">
            AURA<span className="text-sky-400 font-extrabold">.</span>ADMIN
          </Link>
          <button className="md:hidden text-neutral-500 hover:text-white transition-colors" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[9px] uppercase tracking-[0.2em] font-extrabold transition-all duration-300 border ${
                  isActive 
                    ? "bg-sky-500/5 text-sky-400 border-sky-500/20 shadow-[0_0_15px_rgba(125,211,252,0.05)]" 
                    : "text-neutral-500 border-transparent hover:bg-white/[0.02] hover:text-white"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-sky-400" : "text-neutral-500"}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-neutral-900/60 bg-neutral-950/40">
          <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-white/[0.01] border border-white/5">
            <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
              <span className="text-sky-400 font-extrabold text-xs">
                {profile
                  ? profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : ".."}
              </span>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest font-extrabold text-white">
                {profile ? profile.name : "System Loading..."}
              </div>
              <div className="text-[8px] uppercase tracking-widest text-neutral-500 font-bold">
                {profile ? profile.role.replace("_", " ") : "Store operations"}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-3 border border-neutral-900 rounded-xl text-[8px] uppercase tracking-wider font-extrabold text-neutral-500 hover:text-white hover:bg-white/[0.02] transition-all duration-300"
            >
              <ArrowLeft className="w-3 h-3" /> Store
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-3 border border-red-950/30 rounded-xl text-[8px] uppercase tracking-wider font-extrabold text-red-500/80 hover:text-red-400 hover:bg-red-950/20 transition-all duration-300"
            >
              <LogOut className="w-3 h-3" /> Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-6 md:px-12 bg-neutral-950/40 border-b border-neutral-900/60 sticky top-0 z-30 backdrop-blur-xl">
          <button 
            className="md:hidden text-neutral-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block">
            <h2 className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-neutral-500">Operation Center</h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/10 text-green-500 text-[8px] uppercase tracking-widest font-extrabold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              SYSTEM ONLINE
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
