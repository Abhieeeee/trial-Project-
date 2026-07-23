"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldAlert, Users, User, ChevronDown, Check, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export type RoleType = "super_admin" | "admin" | "staff" | "user";

interface RoleOption {
  id: RoleType;
  label: string;
  badge: string;
  color: string;
  icon: any;
  href: string;
}

const roleOptions: RoleOption[] = [
  {
    id: "super_admin",
    label: "Super Admin",
    badge: "Level 4 // Master HUD",
    color: "text-red-400 border-red-500/30 bg-red-500/10",
    icon: ShieldAlert,
    href: "/super-admin/dashboard",
  },
  {
    id: "admin",
    label: "Store Admin",
    badge: "Level 3 // Store Operations",
    color: "text-[#00D2FF] border-[#00D2FF]/30 bg-[#00D2FF]/10",
    icon: Shield,
    href: "/admin/dashboard",
  },
  {
    id: "staff",
    label: "Fulfillment Staff",
    badge: "Level 2 // Orders & Stock",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    icon: Users,
    href: "/admin/orders",
  },
  {
    id: "user",
    label: "Customer / VIP",
    badge: "Level 1 // Shopper Storefront",
    color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    icon: User,
    href: "/user-dashboard",
  },
];

export default function RoleSwitcher() {
  const [baseRole, setBaseRole] = useState<RoleType | null>(null);
  const [activeRole, setActiveRole] = useState<RoleType | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadUserRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        let userBaseRole: RoleType | null = null;

        if (user) {
          if (user.email === "super@aurastreet.com") {
            userBaseRole = "super_admin";
          } else if (user.email === "admin@aurastreet.com") {
            userBaseRole = "admin";
          } else if (user.email === "staff@aurastreet.com") {
            userBaseRole = "staff";
          } else {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", user.id)
              .single();
            userBaseRole = (profile?.role as RoleType) || "user";
          }
        } else {
          // Check local stored session
          const savedSession = localStorage.getItem("aura_user_session");
          if (savedSession) {
            const parsed = JSON.parse(savedSession);
            if (parsed.email === "super@aurastreet.com") userBaseRole = "super_admin";
            else if (parsed.email === "admin@aurastreet.com") userBaseRole = "admin";
            else if (parsed.email === "staff@aurastreet.com") userBaseRole = "staff";
            else userBaseRole = "user";
          }
        }

        // If on super-admin path, default baseRole to super_admin if unassigned
        if (!userBaseRole && typeof window !== "undefined" && window.location.pathname.startsWith("/super-admin")) {
          userBaseRole = "super_admin";
        }

        setBaseRole(userBaseRole || "super_admin");

        // Read active impersonated/switched role if present
        const storedActiveRole = localStorage.getItem("aura_active_role") as RoleType;
        if (storedActiveRole && canSwitchTo(userBaseRole || "super_admin", storedActiveRole)) {
          setActiveRole(storedActiveRole);
        } else {
          setActiveRole(userBaseRole || "super_admin");
        }
      } catch (err) {
        console.error("RoleSwitcher load error:", err);
        setBaseRole("super_admin");
        setActiveRole("super_admin");
      } finally {
        setLoading(false);
      }
    }

    loadUserRole();
  }, []);

  // Rules:
  // super_admin -> can switch to super_admin, admin, staff, user
  // admin -> can switch to admin, staff, user (CANNOT switch to super_admin)
  // staff -> CANNOT switch roles
  // user -> CANNOT switch roles
  function canSwitchTo(base: RoleType | null, target: RoleType): boolean {
    if (!base) return true;
    if (base === "super_admin") return true; // super admin can switch to all
    if (base === "admin") {
      return target === "admin" || target === "staff" || target === "user";
    }
    return false;
  }

  const handleRoleSwitch = (target: RoleOption) => {
    const effectiveBase = baseRole || "super_admin";
    if (!canSwitchTo(effectiveBase, target.id)) return;

    localStorage.setItem("aura_active_role", target.id);
    document.cookie = `aura_active_role=${target.id}; path=/; max-age=86400`;
    setActiveRole(target.id);
    setDropdownOpen(false);

    // Instant redirect to target role environment
    window.location.href = target.href;
  };

  const isSuperAdminPath = typeof window !== "undefined" && window.location.pathname.startsWith("/super-admin");

  // If user is staff, user, or not logged in (and not on super-admin), hide role switcher
  if (!isSuperAdminPath && (loading || !baseRole || (baseRole !== "super_admin" && baseRole !== "admin"))) {
    return null;
  }

  const allowedOptions = roleOptions.filter((opt) => canSwitchTo(baseRole, opt.id));
  const currentRoleOpt = roleOptions.find((opt) => opt.id === activeRole) || roleOptions[0];

  return (
    <div className="relative font-mono z-50">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[9px] uppercase tracking-[0.2em] font-bold transition-all cursor-pointer ${currentRoleOpt.color}`}
        title={`Base Role: ${(baseRole || "super_admin").toUpperCase()} | Active View: ${currentRoleOpt.label}`}
      >
        <currentRoleOpt.icon className="w-3.5 h-3.5" />
        <span>View: {currentRoleOpt.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-64 bg-neutral-950 border border-neutral-800 rounded-xl p-2 z-50 shadow-2xl backdrop-blur-2xl"
            >
              <div className="px-3 py-2 border-b border-neutral-900 mb-1 flex items-center justify-between">
                <span className="text-[8px] uppercase tracking-widest text-neutral-500 font-bold">
                  Role Switcher Mode
                </span>
                <span className="text-[7px] uppercase tracking-wider text-[#00D2FF] font-extrabold bg-[#00D2FF]/10 px-1.5 py-0.5 rounded border border-[#00D2FF]/30">
                  {baseRole === "super_admin" ? "SUPER ADMIN ACCESS" : "ADMIN ACCESS"}
                </span>
              </div>

              <div className="space-y-1">
                {allowedOptions.map((opt) => {
                  const isCurrent = activeRole === opt.id;
                  const IconComponent = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleRoleSwitch(opt)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        isCurrent
                          ? `${opt.color} bg-white/[0.04]`
                          : "border-transparent text-neutral-400 hover:text-white hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent className="w-4 h-4 shrink-0" />
                        <div>
                          <p className="text-[9px] uppercase tracking-wider font-extrabold">
                            {opt.label}
                          </p>
                          <p className="text-[7px] text-neutral-500 tracking-widest">
                            {opt.badge}
                          </p>
                        </div>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {baseRole === "admin" && (
                <div className="mt-2 pt-2 border-t border-neutral-900 px-2 py-1 text-[7px] uppercase tracking-widest text-neutral-600">
                  🚫 Super Admin switching restricted to Super Admin accounts only
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
