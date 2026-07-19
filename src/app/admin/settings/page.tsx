"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Palette, Key, Database, Shield, CheckCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "appearance" | "security">("general");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // General settings state
  const [storeName, setStoreName] = useState("AURA.STREET");
  const [storeEmail, setStoreEmail] = useState("ops@aurastreet.com");
  const [currency, setCurrency] = useState("EUR");

  // Notifications state
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [inventoryAlerts, setInventoryAlerts] = useState(true);
  const [staffActivityLogs, setStaffActivityLogs] = useState(false);

  // Appearance state
  const [theme, setTheme] = useState("dark");
  const [compactMode, setCompactMode] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setSuccess(false);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  const tabs = [
    { id: "general", label: "Store Info", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "security", label: "Access & Security", icon: Shield },
  ] as const;

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-white mb-2">System Settings</h1>
          <p className="text-xs text-neutral-400 uppercase tracking-widest">
            Configure system configurations, notification triggers, and operational states.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-3 rounded bg-white text-black hover:bg-brand-sky text-[10px] uppercase tracking-widest font-bold cursor-pointer transition-colors flex items-center gap-2"
        >
          {saving ? "Saving Changes..." : success ? "Settings Saved" : "Save Settings"}
          {success && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-1.5 lg:col-span-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[9px] uppercase tracking-[0.2em] font-extrabold transition-all duration-300 border text-left cursor-pointer ${
                  isActive
                    ? "bg-sky-500/5 text-sky-400 border-sky-500/20"
                    : "text-neutral-500 border-transparent hover:bg-white/[0.02] hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="lg:col-span-3 glass-panel-glow rounded-xl p-6 min-h-[400px]">
          {activeTab === "general" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white border-b border-neutral-800 pb-3">Store Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Store Brand Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-sky"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Operational Email</label>
                  <input
                    type="email"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-sky"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Base Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-sky"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white border-b border-neutral-800 pb-3">Operational Alerts</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/40 border border-neutral-800 rounded-xl">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-white">Order Creation Alerts</h3>
                    <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider">Send Slack or Email alerts when new orders arrive.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={orderAlerts}
                    onChange={(e) => setOrderAlerts(e.target.checked)}
                    className="w-4 h-4 accent-brand-sky cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-black/40 border border-neutral-800 rounded-xl">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-white">Low Stock Telemetry</h3>
                    <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider">Alert staff when product inventory falls below 15 units.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={inventoryAlerts}
                    onChange={(e) => setInventoryAlerts(e.target.checked)}
                    className="w-4 h-4 accent-brand-sky cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-black/40 border border-neutral-800 rounded-xl">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-white">Security Logs Sync</h3>
                    <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider">Forward staff actions logs to active audit channel.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={staffActivityLogs}
                    onChange={(e) => setStaffActivityLogs(e.target.checked)}
                    className="w-4 h-4 accent-brand-sky cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "appearance" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white border-b border-neutral-800 pb-3">Interface Theme</h2>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Admin Theme Mode</label>
                  <div className="flex gap-3">
                    {["dark", "oled", "light"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`flex-1 py-3 rounded-lg border text-[9px] uppercase tracking-widest font-extrabold cursor-pointer transition-colors ${
                          theme === t
                            ? "bg-brand-sky/20 border-brand-sky text-brand-sky"
                            : "bg-black border-neutral-800 text-neutral-500 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/40 border border-neutral-800 rounded-xl mt-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-white">Compact Lists</h3>
                    <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider">Reduce layout spacing in grids and tables.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={compactMode}
                    onChange={(e) => setCompactMode(e.target.checked)}
                    className="w-4 h-4 accent-brand-sky cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white border-b border-neutral-800 pb-3">Access Security</h2>

              <div className="space-y-4">
                <div className="p-4 bg-black/40 border border-neutral-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-brand-sky" />
                    <h3 className="text-xs font-bold uppercase tracking-wide text-white">API Keys</h3>
                  </div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Supabase integration client endpoint and public keys are active.</p>
                </div>

                <div className="p-4 bg-black/40 border border-neutral-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wide text-white">Database Engine</h3>
                  </div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">PostgreSQL instance is running on Supabase with enabled RLS security.</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
