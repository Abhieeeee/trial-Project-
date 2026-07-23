"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import RoleSwitcher from "@/components/RoleSwitcher";

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
          .select("name, role, email")
          .eq("id", user.id)
          .single();
        if (data) {
          const role = data.email === "staff@aurastreet.com" ? "staff" : data.role;
          setProfile({ name: data.name, role: role });
        }
      }
    }
    loadProfile();
  }, []);

  // If on login page, render clean black canvas
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  const allNavItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Inventory", href: "/admin/inventory", icon: Warehouse },
    { name: "Products", href: "/admin/products", icon: PackageSearch },
    { name: "Customers", href: "/admin/customers", icon: UsersRound },
    { name: "Settings", href: "/admin/access", icon: Settings },
  ];

  const navItems = profile?.role === "staff"
    ? allNavItems.filter(item => ["Orders", "Inventory"].includes(item.name))
    : allNavItems;

  const isSuperAdmin = profile?.role === "super_admin";
  const isStaff = profile?.role === "staff";

  const themeAccent = isSuperAdmin
    ? "text-red-400 border-red-500/30 bg-red-500/10 shadow-red-500/20"
    : isStaff
    ? "text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-amber-500/20"
    : "text-[#00D2FF] border-[#00D2FF]/30 bg-[#00D2FF]/10 shadow-[#00D2FF]/20";

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden relative font-sans selection:bg-[#00D2FF]/30 selection:text-white">
      
      {/* Ambient Cyber Light Blobs */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00D2FF]/[0.025] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-md" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/80 border-r border-white/10 backdrop-blur-2xl transform transition-transform duration-300 md:translate-x-0 md:static md:w-64 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/10 justify-between">
          <Link href={isStaff ? "/admin/orders" : "/admin/dashboard"} className="group flex items-center gap-2 select-none">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#00D2FF] transition-all">
              <Zap className="w-4 h-4 text-[#00D2FF]" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.25em] uppercase font-display text-white">
                AURA<span className="text-[#00D2FF]">.</span>{isStaff ? "STAFF" : "COMMAND"}
              </p>
              <p className="text-[7px] uppercase tracking-widest text-neutral-500 font-mono">
                {isSuperAdmin ? "Super Admin Level 4" : isStaff ? "Fulfillment Queue" : "Operations Telemetry"}
              </p>
            </div>
          </Link>

          <button className="md:hidden text-neutral-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Item Links */}
        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1.5 font-mono">
          <p className="px-3 mb-1 text-[8px] uppercase tracking-[0.3em] font-bold text-neutral-500 select-none">
            MAIN NAVIGATION
          </p>

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-[9px] uppercase tracking-[0.2em] font-bold transition-all duration-200 group border ${
                  isActive 
                    ? "bg-white/5 text-white border-white/20 shadow-lg" 
                    : "text-neutral-400 border-transparent hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                <item.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-[#00D2FF]" : "text-neutral-500 group-hover:text-white"}`} />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#00D2FF] shadow-[0_0_8px_#00D2FF]"
                  />
                )}
              </Link>
            );
          })}

          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2">
            <p className="px-3 text-[8px] uppercase tracking-[0.3em] font-bold text-neutral-500 select-none">
              SHORTCUTS & ACCESS
            </p>

            <Link
              href="/dashboard/admin"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[9px] uppercase tracking-[0.2em] font-bold transition-all border bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
              Console Dashboard
            </Link>

            {isSuperAdmin && (
              <Link
                href="/super-admin/dashboard"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[9px] uppercase tracking-[0.2em] font-bold transition-all border bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                Super Admin HUD
              </Link>
            )}
          </div>
        </div>

        {/* User Card & Actions */}
        <div className="p-4 border-t border-white/10 bg-black/60 font-mono">
          <div className="flex items-center gap-3 px-3.5 py-3 mb-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center border font-extrabold text-xs shadow-md ${themeAccent}`}>
              {profile
                ? profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "AS"}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-white truncate">
                {profile ? profile.name : "Active Session"}
              </p>
              <p className="text-[8px] uppercase tracking-widest text-neutral-400 font-bold">
                {profile ? profile.role.replace("_", " ") : "Telemetry Online"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 border border-white/10 rounded-lg text-[8px] uppercase tracking-wider font-bold text-neutral-400 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="w-3 h-3" /> Storefront
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 border border-red-500/30 rounded-lg text-[8px] uppercase tracking-wider font-bold text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <LogOut className="w-3 h-3" /> Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-6 md:px-10 bg-black/60 border-b border-white/10 sticky top-0 z-30 backdrop-blur-2xl font-mono">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-neutral-400 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-white">
                Aura Operation Tower
              </span>
              <span className="text-neutral-600 text-xs">/</span>
              <span className="text-[9px] uppercase tracking-widest text-[#00D2FF] font-bold">
                {pathname.replace("/admin/", "").replace("/", " ").toUpperCase() || "DASHBOARD"}
              </span>
            </div>
          </div>

          {/* Top Controls & Status */}
          <div className="flex items-center gap-4">
            <RoleSwitcher />

            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] uppercase tracking-widest font-extrabold shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Telemetry Live</span>
            </div>
          </div>
        </header>

        {/* Page Body View */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
