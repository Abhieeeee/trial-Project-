"use client";

import { useState, useEffect } from "react";
import { Download, Plus, Trash2, ShieldAlert, Sparkles, UserX } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

export default function SuperAdminCustomersPage() {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = createClient();

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCustomers(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const changeUserRole = async (profileId: string, newRole: string) => {
    setUpdatingId(profileId);
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq("id", profileId);

    if (!error) {
      setCustomers(prev =>
        prev.map(c => (c.id === profileId ? { ...c, role: newRole as any } : c))
      );
    } else {
      alert(`Failed to update role: ${error.message}`);
    }
    setUpdatingId(null);
  };

  // Metrics
  const totalCount = customers.length;
  const staffCount = customers.filter(c => c.role === "admin" || c.role === "super_admin").length;
  const vipCount = Math.round(totalCount * 0.1); // simulated LTV segmentation
  const newThisMonth = customers.filter(c => {
    const registeredDate = new Date(c.created_at);
    const now = new Date();
    return registeredDate.getMonth() === now.getMonth() && registeredDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-red-500">Customer administration</p>
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-white">Customers & Profiles</h1>
          <p className="mt-3 max-w-2xl text-xs uppercase tracking-[0.12em] text-neutral-400">
            Manage customer access, role escalation, profiles telemetry, and account restrictions.
          </p>
        </div>
        <button
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customers));
            const downloadAnchor = document.createElement("a");
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "all_customers.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="inline-flex items-center gap-2 rounded-md border border-neutral-700 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-white hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          Export customers
        </button>
      </div>

      <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          ["Total Users", totalCount.toString()],
          ["System Staff", staffCount.toString()],
          ["VIP (Simulated)", vipCount.toString()],
          ["New this month", newThisMonth.toString()],
        ].map(([label, value]) => (
          <div key={label} className="glass-panel-glow rounded-lg p-5">
            <Sparkles className="mb-4 h-4 w-4 text-red-500" />
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-500">{label}</p>
            <p className="mt-2 text-xl font-bold text-white">{loading ? "..." : value}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-800 p-5">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Profiles Control List</h2>
          <span className="inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.14em] text-red-400">
            <ShieldAlert className="h-3.5 w-3.5" />Elevated controls enabled
          </span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-xs uppercase tracking-widest text-neutral-500">
            Loading user profiles...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-xs uppercase tracking-widest text-neutral-500">
            No profiles registered.
          </div>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-800 p-5 last:border-0 md:grid-cols-[1fr_1fr_auto]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                  {customer.name || "Guest Account"}
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.13em] text-neutral-500">
                  {customer.email} // Joined {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="hidden text-[10px] uppercase tracking-[0.13em] text-neutral-400 md:block">
                Role: <span className="text-white font-bold">{customer.role.toUpperCase()}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextRole = customer.role === "user" ? "admin" : customer.role === "admin" ? "super_admin" : "user";
                    if (confirm(`Promote/Demote user role to: ${nextRole}?`)) {
                      changeUserRole(customer.id, nextRole);
                    }
                  }}
                  disabled={updatingId === customer.id}
                  className="rounded-md border border-neutral-700 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.12em] text-white hover:border-red-500 cursor-pointer"
                >
                  Change Role
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Suspending user: ${customer.email}. API simulation only.`)}
                  title="Suspend User Access"
                  className="rounded-md border border-red-500/20 p-2 text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <UserX className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
