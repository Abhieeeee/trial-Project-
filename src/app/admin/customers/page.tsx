"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Search, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

export default function AdminCustomersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const supabase = createClient();

  const fetchCustomers = async () => {
    setLoading(true);
    // Query users with 'user' role or any role except staff/admin for consumer directory
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProfiles(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = profiles.filter((customer) => {
    const name = customer.name || "";
    const email = customer.email || "";
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-sans font-extrabold uppercase tracking-wider text-white mb-2">Customers</h1>
          <p className="text-xs text-neutral-400 uppercase tracking-widest">
            Customer directories, permissions tracking, profiles telemetry, and support context.
          </p>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-panel-glow p-4 rounded-xl">
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Total Users</div>
          <div className="text-xl font-display font-bold text-white">{loading ? "..." : profiles.length}</div>
        </div>
        <div className="glass-panel-glow p-4 rounded-xl">
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Active Roles</div>
          <div className="text-xl font-display font-bold text-sky-400">
            {loading ? "..." : `${new Set(profiles.map(p => p.role)).size} Active`}
          </div>
        </div>
        <div className="glass-panel-glow p-4 rounded-xl">
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Growth (July)</div>
          <div className="text-xl font-display font-bold text-emerald-400">Stable</div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-brand-sky text-white placeholder:text-neutral-600"
            placeholder="Search customer name or email..."
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-neutral-500 text-xs uppercase tracking-widest">
          Loading customer records...
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 text-xs uppercase tracking-widest">
          No customers found matching query.
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCustomers.map((customer, index) => {
            const initials = (customer.name || "")
              .split(" ")
              .map(n => n[0])
              .join("")
              .toUpperCase();

            // Set dynamic aesthetic tag color based on role
            const roleColor =
              customer.role === "super_admin"
                ? "text-red-400 bg-red-500/10 border-red-500/20"
                : customer.role === "admin"
                ? "text-sky-400 bg-sky-500/10 border-sky-500/20"
                : "text-neutral-400 bg-neutral-800 border-neutral-700";

            return (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-panel-glow rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-sky/35 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-brand-sky/10 border border-brand-sky/20 flex items-center justify-center font-display font-extrabold text-xs text-brand-sky">
                    {initials || <UserRound className="w-5 h-5 text-brand-sky" />}
                  </div>
                  <div>
                    <h2 className="text-sm uppercase tracking-[0.16em] font-bold text-white">
                      {customer.name || "Unnamed Account"}
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 flex items-center gap-2 mt-1">
                      <Mail className="w-3 h-3 text-neutral-500" />
                      {customer.email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                  <div>
                    <span className="block text-white">
                      {new Date(customer.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                    Registered
                  </div>
                  <div>
                    <span className={`block px-2 py-0.5 rounded border text-center ${roleColor}`}>
                      {customer.role.toUpperCase()}
                    </span>
                    Security Role
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
