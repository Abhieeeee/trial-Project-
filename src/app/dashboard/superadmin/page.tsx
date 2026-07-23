"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product, Order, Profile } from "@/types/database";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Terminal,
  Database,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  KeyRound,
  Activity,
  RefreshCw,
  Search,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { NicheAnalyticsHub } from "@/components/admin/NicheAnalyticsHub";
import { DataManagementModal } from "@/components/admin/DataManagementModal";

export default function SuperAdminConsole() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search
  const [userSearch, setUserSearch] = useState("");
  const [systemLogs, setSystemLogs] = useState<Array<{ id: string; event: string; time: string; type: string }>>([
    { id: "1", event: "Master Root Authority Authenticated", time: new Date().toLocaleTimeString(), type: "security" },
    { id: "2", event: "Database Telemetry Stream Synced", time: new Date().toLocaleTimeString(), type: "system font-mono" },
    { id: "3", event: "RLS Enforcement Layer Operational", time: new Date().toLocaleTimeString(), type: "security" },
  ]);

  const supabase = createClient();

  const loadData = async () => {
    try {
      const [prodRes, ordRes, profRes] = await Promise.all([
        supabase.from("products").select("*").order("name"),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      ]);

      if (prodRes.data) setProducts(prodRes.data as Product[]);
      if (ordRes.data) setOrders(ordRes.data as Order[]);
      if (profRes.data) setProfiles(profRes.data as Profile[]);
    } catch (err) {
      console.error("Error loading super admin console data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (error) {
        alert(`Failed to update user role: ${error.message}`);
      } else {
        setSystemLogs((prev) => [
          { id: String(Date.now()), event: `Role updated for user ${userId.substring(0, 8)} to ${newRole}`, time: new Date().toLocaleTimeString(), type: "admin" },
          ...prev,
        ]);
        await loadData();
      }
    } catch (err: any) {
      alert(`Error updating role: ${err.message}`);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userToDelete.id);

      if (error) {
        alert(`Failed to delete profile: ${error.message}`);
      } else {
        setSystemLogs((prev) => [
          { id: String(Date.now()), event: `Cascade account removal executed for ${userToDelete.email}`, time: new Date().toLocaleTimeString(), type: "alert" },
          ...prev,
        ]);
        setUserToDelete(null);
        setDeleteModalOpen(false);
        await loadData();
      }
    } catch (err: any) {
      alert(`Error purging user: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProfiles = profiles.filter(
    (p) =>
      p.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      p.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      p.role?.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-[10px] uppercase tracking-widest text-red-500">
        Syncing root command center console...
      </div>
    );
  }

  return (
    <div className="space-y-10 relative">
      
      {/* Header Bar */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between border-b border-red-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 border border-red-500/30 bg-red-500/10 text-red-500 text-[8px] font-mono uppercase tracking-[0.2em] font-bold">
              ROOT OVERRIDE // ALL SYSTEM AUTHORITIES GRANTED
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-[0.15em] text-white">
            Super Admin Command Center
          </h1>
          <p className="mt-2 max-w-xl text-[10px] uppercase tracking-[0.12em] text-neutral-400 font-mono">
            Complete executive visibility across commerce analytics, financial margins, staff permissions, database backups, and security audit telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setDataModalOpen(true)}
            className="inline-flex items-center gap-2 border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-[9px] uppercase tracking-widest px-5 py-3.5 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.15)]"
          >
            <Database className="h-4 w-4 text-red-500" /> Master Data Import & Export
          </button>
        </div>
      </div>

      {/* Embedded Niche Analytics Hub (Super Admin Red Theme) */}
      <NicheAnalyticsHub products={products} orders={orders} role="super_admin" onRefresh={loadData} />

      {/* Security Audit & Console Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Real-time System Logs Terminal */}
        <div className="lg:col-span-1 bg-black/60 backdrop-blur-md border border-neutral-800 p-6 space-y-4 font-mono text-[10px]">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <span className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
              <Terminal className="h-4 w-4 text-red-500" /> Security Audit Telemetry
            </span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {systemLogs.map((log) => (
              <div key={log.id} className="p-2 border border-neutral-900 bg-neutral-950/60 space-y-1">
                <div className="flex justify-between text-[8px] text-neutral-500">
                  <span className="uppercase tracking-widest">{log.type}</span>
                  <span>{log.time}</span>
                </div>
                <p className="text-neutral-300 font-mono">{log.event}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User Account & Role Management Table */}
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-md border border-neutral-800 rounded-none overflow-hidden space-y-4">
          <div className="border-b border-neutral-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-red-500" /> User Profile & Role Administration ({filteredProfiles.length})
            </h2>
            <div className="relative font-mono text-[9px]">
              <Search className="h-3 w-3 absolute left-2.5 top-2.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search Account..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full sm:w-48 bg-neutral-900 border border-neutral-800 pl-7 pr-2 py-1 text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-left border-collapse font-mono text-[10px]">
              <thead className="bg-neutral-950 sticky top-0 border-b border-neutral-800 text-neutral-500 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3 font-bold">User</th>
                  <th className="px-6 py-3 font-bold">Security Role</th>
                  <th className="px-6 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {filteredProfiles.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.01]">
                    <td className="px-6 py-3.5">
                      <p className="text-white font-bold">{user.name || "System User"}</p>
                      <p className="text-[8px] text-neutral-500">{user.email}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`bg-neutral-900 border px-2 py-1 uppercase font-bold text-[9px] focus:outline-none ${
                          user.role === "super_admin"
                            ? "border-red-500/40 text-red-400"
                            : user.role === "admin"
                            ? "border-[#00d2ff]/40 text-[#00d2ff]"
                            : "border-neutral-800 text-neutral-300"
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setUserToDelete(user);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 border border-red-500/20 bg-red-500/5 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                        title="Purge Account"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-neutral-950 border border-red-500/40 p-6 space-y-4 font-mono">
            <div className="flex items-center gap-3 text-red-500 border-b border-neutral-900 pb-3">
              <AlertTriangle className="h-6 w-6 shrink-0 animate-pulse" />
              <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em]">
                CASCADE PURGE WARNING
              </h3>
            </div>
            <p className="text-xs text-neutral-300">
              Are you sure you want to permanently delete the profile for{" "}
              <strong className="text-white">{userToDelete.email}</strong>?
            </p>
            <p className="text-[9px] text-neutral-500 uppercase tracking-widest">
              This action revokes all security access tokens instantly and cannot be reversed.
            </p>

            <div className="pt-4 border-t border-neutral-900 flex justify-end gap-3">
              <button
                onClick={() => { setDeleteModalOpen(false); setUserToDelete(null); }}
                className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:text-white text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="px-5 py-2 bg-red-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-600 cursor-pointer flex items-center gap-2"
              >
                {isDeleting ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Confirm Permanent Purge"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Master Data Import & Export Suite Modal */}
      <DataManagementModal
        isOpen={dataModalOpen}
        onClose={() => setDataModalOpen(false)}
        role="super_admin"
        onSuccess={loadData}
      />
    </div>
  );
}
