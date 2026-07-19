"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Plus, ShieldCheck, UserCog, UserCheck, UserX } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

export default function SuperAdminStaffPage() {
  const [staff, setStaff] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const supabase = createClient();

  const fetchStaff = async () => {
    setLoading(true);
    // Query users with 'admin' or 'super_admin' roles
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .in("role", ["admin", "super_admin"])
      .order("name");

    if (!error && data) {
      setStaff(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const changeRole = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === "admin" ? "super_admin" : "admin";
    if (!confirm(`Are you sure you want to change this user's role to ${nextRole}?`)) return;

    const { error } = await supabase
      .from("profiles")
      .update({ role: nextRole, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (!error) {
      setStaff(prev =>
        prev.map(s => (s.id === userId ? { ...s, role: nextRole as any } : s))
      );
    } else {
      alert(`Failed to change role: ${error.message}`);
    }
  };

  const deleteStaff = async (userId: string) => {
    if (!confirm("Are you sure you want to suspend this staff member? their role will be set to 'user'.")) return;

    const { error } = await supabase
      .from("profiles")
      .update({ role: "user", updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (!error) {
      setStaff(prev => prev.filter(s => s.id !== userId));
    } else {
      alert(`Failed to suspend staff: ${error.message}`);
    }
  };

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-red-500 font-display">Super Admin only</p>
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-white">Staff Management</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.12em] text-neutral-400">
            Invite admins, change roles, suspend access, and inspect staff activity.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const email = prompt("Enter email of the user to invite as Admin:");
            if (email) {
              alert(`Simulated invitation sent to: ${email}`);
            }
          }}
          className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-black hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Invite Admin
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-neutral-500 text-xs uppercase tracking-widest">
          Querying staff members directory...
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 text-xs uppercase tracking-widest">
          No staff members found in database.
        </div>
      ) : (
        <section className="grid gap-4">
          {staff.map((member) => (
            <div
              key={member.id}
              className="relative grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-5 md:grid-cols-[auto_1.5fr_1fr_1fr_auto]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
                <UserCog className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white">{member.name || "Unnamed Staff"}</p>
                <p className="mt-1 text-[9px] text-neutral-500">{member.email}</p>
              </div>
              <div className="hidden md:block">
                <p className="text-[8px] uppercase tracking-[0.14em] text-neutral-500">Security Role</p>
                <p className="mt-1 text-[10px] text-white font-bold">{member.role.toUpperCase().replace("_", " ")}</p>
              </div>
              <div className="hidden md:block">
                <p className="text-[8px] uppercase tracking-[0.14em] text-neutral-500">Joined Date</p>
                <p className="mt-1 text-[10px] text-neutral-400">{new Date(member.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden items-center gap-1 text-[8px] font-bold uppercase sm:flex text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Active
                </span>
                <div className="relative">
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)}
                    type="button"
                    title="Staff actions"
                    className="rounded-md border border-neutral-700 p-2 hover:border-red-500 cursor-pointer text-white"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {/* Actions Dropdown */}
                  {activeMenuId === member.id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-black border border-neutral-800 p-1.5 shadow-2xl z-50">
                      <button
                        onClick={() => {
                          changeRole(member.id, member.role);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 text-[9px] uppercase tracking-widest font-bold text-white hover:bg-neutral-900 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                        Toggle Role
                      </button>
                      <button
                        onClick={() => {
                          deleteStaff(member.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 text-[9px] uppercase tracking-widest font-bold text-red-400 hover:bg-red-500/10 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        Suspend Staff
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
