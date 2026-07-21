"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Warehouse,
  PackageSearch,
  UsersRound,
  Terminal,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<{ name: string; role: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace("/admin/login");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("name, role, email")
          .eq("id", user.id)
          .single();

        if (error || !data) {
          console.error("Error loading profile:", error?.message);
          router.replace("/admin/login");
          return;
        }

        const role = data.email === "staff@aurastreet.com" ? "staff" : data.role;
        setProfile({ name: data.name, role: role, email: data.email });

        // Defense-in-depth path validation
        if (role === "staff" && !pathname.startsWith("/dashboard/staff")) {
          router.replace("/dashboard/staff");
        } else if (role === "admin" && !pathname.startsWith("/dashboard/admin") && !pathname.startsWith("/dashboard/staff")) {
          router.replace("/dashboard/admin");
        }
      } catch (err) {
        console.error("Profile load exception:", err);
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [pathname, router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#030303] z-[9999] flex flex-col items-center justify-center font-mono select-none">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute w-12 h-12 border-2 border-t-transparent border-neutral-700 rounded-full animate-spin" />
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
        </div>
        <p className="mt-6 text-[8px] uppercase tracking-[0.25em] text-neutral-500 font-bold">
          ESTABLISHING AURA.SECURE CHANNEL...
        </p>
      </div>
    );
  }

  if (!profile) return null;

  // Set the theme token based on role
  const isSuperAdmin = profile.role === "super_admin";
  const isAdmin = profile.role === "admin";
  const isStaff = profile.role === "staff";

  let accentColorClass = "text-white";
  let accentBorderClass = "border-white/10";
  let accentBgClass = "bg-white/5";
  let accentBadgeClass = "border-white/20 bg-white/5 text-white";
  let activeNavItemClass = "bg-white/5 text-white border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.02)]";
  let systemStatusClass = "text-white bg-white/5 border-white/10";
  let brandTextSpan = <span className="text-white font-extrabold">.</span>;

  if (isSuperAdmin) {
    accentColorClass = "text-red-500";
    accentBorderClass = "border-red-500/20";
    accentBgClass = "bg-red-500/5";
    accentBadgeClass = "border-red-500/20 bg-red-500/5 text-red-500";
    activeNavItemClass = "bg-red-500/5 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]";
    systemStatusClass = "text-red-400 bg-red-500/5 border-red-500/10";
    brandTextSpan = <span className="text-red-500 font-extrabold">.</span>;
  } else if (isAdmin) {
    accentColorClass = "text-[#00d2ff]";
    accentBorderClass = "border-[#00d2ff]/20";
    accentBgClass = "bg-[#00d2ff]/5";
    accentBadgeClass = "border-[#00d2ff]/20 bg-[#00d2ff]/5 text-[#00d2ff]";
    activeNavItemClass = "bg-[#00d2ff]/5 text-[#00d2ff] border-[#00d2ff]/20 shadow-[0_0_15px_rgba(0,210,255,0.05)]";
    systemStatusClass = "text-[#00d2ff] bg-[#00d2ff]/5 border-[#00d2ff]/10";
    brandTextSpan = <span className="text-[#00d2ff] font-extrabold">.</span>;
  }

  // Define navigation items based on role
  const allNavItems = [
    { name: "Staff Workspace", href: "/dashboard/staff", icon: Warehouse, allowedRoles: ["staff", "admin", "super_admin"] },
    { name: "Admin Console", href: "/dashboard/admin", icon: Sliders, allowedRoles: ["admin", "super_admin"] },
    { name: "Super Override", href: "/dashboard/superadmin", icon: Terminal, allowedRoles: ["super_admin"] },
  ];

  // Load sliders icons dynamically as fallback if not present, otherwise use layout dashboard
  const SlidersIcon = Sliders;

  const navItems = allNavItems.filter(item => item.allowedRoles.includes(profile.role));

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex overflow-hidden relative">
      {/* 8px CSS Radial Grid Background Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.015) 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-black/60 border-r border-white/5 backdrop-blur-2xl transform transition-transform duration-300 md:translate-x-0 md:static md:w-72 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Sidebar Header */}
        <div className="h-24 flex items-center px-8 border-b border-white/5 justify-between">
          <Link href="/dashboard/staff" className="text-xs font-bold tracking-[0.35em] uppercase font-display select-none text-white flex items-center gap-1.5 font-bold">
            AURA{brandTextSpan}PORTAL
          </Link>
          <button className="md:hidden text-neutral-500 hover:text-white transition-colors" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Badge */}
        <div className="border-b border-white/5 px-6 py-6">
          <div className={`flex items-center gap-3 rounded-lg border ${accentBorderClass} ${accentBgClass} px-4 py-3.5`}>
            <ShieldCheck className={`h-4.5 w-4.5 ${accentColorClass}`} />
            <div>
              <p className={`text-[9px] font-extrabold uppercase tracking-[0.2em] ${accentColorClass}`}>
                {profile.role.replace("_", " ")}
              </p>
              <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-neutral-500 font-mono">
                SECURE IDENTITY // ACTIVE
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2" aria-label="Portal Navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-lg text-[9px] uppercase tracking-[0.2em] font-mono transition-all duration-300 border ${
                  isActive 
                    ? activeNavItemClass 
                    : "text-neutral-500 border-transparent hover:bg-white/[0.02] hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="p-5 border-t border-white/5 bg-black/40">
          <div className="flex items-center gap-3 px-4 py-3.5 mb-4 rounded-lg bg-white/[0.01] border border-white/5">
            <div className={`w-9 h-9 rounded-full ${accentBgClass} flex items-center justify-center border ${accentBorderClass}`}>
              <span className={`font-bold text-xs ${accentColorClass}`}>
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <div className="truncate text-[10px] font-bold uppercase tracking-[0.14em]">
                {profile.name}
              </div>
              <div className="truncate text-[7px] font-mono tracking-widest text-neutral-500 mt-0.5">
                {profile.email}
              </div>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-3 border border-white/5 rounded-lg text-[8px] uppercase tracking-wider font-mono font-bold text-neutral-500 hover:text-white hover:bg-white/[0.02] transition-all duration-300"
            >
              <ArrowLeft className="w-3 h-3" /> Store
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-3 border border-red-950/20 rounded-lg text-[8px] uppercase tracking-wider font-mono font-bold text-red-500/80 hover:text-red-400 hover:bg-red-950/10 transition-all duration-300"
            >
              <LogOut className="w-3 h-3" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-24 flex items-center justify-between px-6 md:px-12 bg-black/20 border-b border-white/5 sticky top-0 z-30 backdrop-blur-xl">
          <button 
            className="md:hidden text-neutral-400 hover:text-white transition-colors animate-pulse"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:block">
            <h2 className="text-[9px] uppercase tracking-[0.3em] font-mono text-neutral-500">OPERATIONAL CONSOLE CORE</h2>
          </div>

          <div className="flex items-center gap-4">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[8px] uppercase tracking-widest font-mono font-bold ${systemStatusClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${accentColorClass} animate-pulse`} />
              SECURE DEPLOYMENT ONLINE
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

// Simple fallback sliders icon component in case it's not imported correctly
function Sliders(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="2" x2="6" y1="14" y2="14" />
      <line x1="10" x2="14" y1="8" y2="8" />
      <line x1="18" x2="22" y1="12" y2="12" />
    </svg>
  );
}
