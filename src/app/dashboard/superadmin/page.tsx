"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product, Order } from "@/types/database";
import {
  Package,
  Receipt,
  Sparkles,
  Plus,
  ArrowRight,
  Loader2,
  X,
  Trash2,
  ShieldAlert,
  Terminal as TerminalIcon,
  Users,
  Check,
} from "lucide-react";

interface Profile {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function SuperAdminArchive() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // System Terminal Logs State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "AURA.OS [VERSION 16.2.10.4] SECURITY COMMAND SHELL",
    "(C) 2026 AURA.STREET TECH OPERATIONS INC. ALL RIGHTS RESERVED.",
    "",
    "AUTHENTICATING SECURE HANDSHAKE LAYER...",
    "SECURE DEPLOYMENT VERIFIED // PRIVILEGE: SUPER_ADMIN_OVERRIDE",
    "INITIALIZING POSTGRES RELATIONAL DATABASE SEEDING ENGINE...",
    "SUCCESS // RELATIONAL INSTANCE CACHE STABLE",
    "LISTENING FOR SYSTEM OVERRIDE TELEMETRY...",
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Hoodies",
    stock: "",
    material: "",
    colorways: "1",
    description: "",
  });

  // Purge/Delete Confirmation State
  const [purgeTarget, setPurgeTarget] = useState<Product | null>(null);
  const [purgeConfirmText, setPurgeConfirmText] = useState("");

  const supabase = createClient();

  function logToTerminal(message: string, type: "INFO" | "SUCCESS" | "ALERT" | "KERNEL" = "INFO") {
    const timestamp = new Date().toISOString().substring(11, 19);
    let prefix = `[${timestamp}] [INFO]`;
    if (type === "SUCCESS") prefix = `[${timestamp}] [OK]`;
    else if (type === "ALERT") prefix = `[${timestamp}] [!!! ALERT !!!]`;
    else if (type === "KERNEL") prefix = `[${timestamp}] [SYS]`;

    setTerminalLogs((prev) => [...prev, `${prefix} ${message.toUpperCase()}`]);
  }

  async function loadData() {
    try {
      const [prodResult, ordResult, profResult] = await Promise.all([
        supabase.from("products").select("*").order("name"),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("email"),
      ]);

      if (prodResult.data) setProducts(prodResult.data as Product[]);
      if (ordResult.data) setOrders(ordResult.data as Order[]);
      if (profResult.data) setProfiles(profResult.data as Profile[]);
      
      logToTerminal("Synchronized database profiles and catalog models.", "SUCCESS");
    } catch (err: any) {
      console.error("Error loading super-admin data:", err);
      logToTerminal(`System sync failed: ${err.message}`, "ALERT");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Auto-scroll terminal logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    setActionLoading("create");
    logToTerminal(`Initializing asset mint sequence for: ${newProduct.name}...`, "KERNEL");

    try {
      const { data, error } = await supabase.from("products").insert([
        {
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          category: newProduct.category,
          stock: parseInt(newProduct.stock),
          material: newProduct.material || "Premium Tech Weave",
          colorways: parseInt(newProduct.colorways),
          description: newProduct.description || "Techwear fashion piece.",
          images: ["/hero-editorial.png"],
          is_active: true,
        },
      ]);

      if (error) {
        alert(`Failed to mint product: ${error.message}`);
        logToTerminal(`Failed to mint product asset: ${error.message}`, "ALERT");
      } else {
        logToTerminal(`Successfully minted and cataloged asset: ${newProduct.name}`, "SUCCESS");
        setDrawerOpen(false);
        setNewProduct({
          name: "",
          price: "",
          category: "Hoodies",
          stock: "",
          material: "",
          colorways: "1",
          description: "",
        });
        await loadData();
      }
    } catch (err: any) {
      alert(`Error creating product: ${err.message}`);
      logToTerminal(`Exception during asset mint: ${err.message}`, "ALERT");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUpdateStatus(orderId: string, currentStatus: string) {
    let nextStatus: Order["status"] = "Pending";
    if (currentStatus === "Pending") nextStatus = "Shipped";
    else if (currentStatus === "Shipped") nextStatus = "Delivered";
    else return;

    setActionLoading(orderId);
    logToTerminal(`Transitioning order status logic for ID: ${orderId.substring(0, 8)}...`, "KERNEL");

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) {
        alert(`Failed to update order status: ${error.message}`);
        logToTerminal(`Order status transition failed: ${error.message}`, "ALERT");
      } else {
        logToTerminal(`Order transition complete: ${currentStatus} -> ${nextStatus}`, "SUCCESS");
        await loadData();
      }
    } catch (err: any) {
      alert(`Error updating order: ${err.message}`);
      logToTerminal(`Exception during order status shift: ${err.message}`, "ALERT");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleAdjustStock(productId: string, currentStock: number) {
    const amountStr = prompt(`Enter new stock level for this item:`, currentStock.toString());
    if (amountStr === null) return;
    const amount = parseInt(amountStr);
    if (isNaN(amount) || amount < 0) {
      alert("Invalid stock level level entered.");
      return;
    }

    setActionLoading(productId);
    logToTerminal(`Modifying storage quantity limit for: ${productId.substring(0, 8)}...`, "KERNEL");

    try {
      const { error } = await supabase
        .from("products")
        .update({ stock: amount, updated_at: new Date().toISOString() })
        .eq("id", productId);

      if (error) {
        alert(`Failed to update stock: ${error.message}`);
        logToTerminal(`Stock modification failed: ${error.message}`, "ALERT");
      } else {
        logToTerminal(`Successfully adjusted stock quantity to: ${amount} units`, "SUCCESS");
        await loadData();
      }
    } catch (err: any) {
      alert(`Error updating stock: ${err.message}`);
      logToTerminal(`Exception during stock adjustment: ${err.message}`, "ALERT");
    } finally {
      setActionLoading(null);
    }
  }

  async function handlePurgeProduct() {
    if (!purgeTarget) return;
    setActionLoading(purgeTarget.id);
    logToTerminal(`Executing irreversible override deletion script on UUID: ${purgeTarget.id}`, "ALERT");

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", purgeTarget.id);

      if (error) {
        alert(`Purge failed: ${error.message}`);
        logToTerminal(`Irreversible override purge failed: ${error.message}`, "ALERT");
      } else {
        logToTerminal(`Permanently purged item catalog listing: ${purgeTarget.name}`, "SUCCESS");
        setPurgeTarget(null);
        setPurgeConfirmText("");
        await loadData();
      }
    } catch (err: any) {
      alert(`Error purging product: ${err.message}`);
      logToTerminal(`Exception during database purge sequence: ${err.message}`, "ALERT");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-[10px] uppercase tracking-widest text-red-500">
        Syncing root override control panel...
      </div>
    );
  }

  return (
    <div className="space-y-12 relative">
      
      {/* Page Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-[8px] font-mono uppercase tracking-[0.3em] text-red-500">
            SECURE ACCESS LAYER // ROOT PRIVILEGES GRANTED // UNRESTRICTED OVERRIDE
          </p>
          <h1 className="font-display text-2xl font-bold uppercase tracking-[0.15em] text-white">
            Super Override Console
          </h1>
          <p className="mt-2 max-w-xl text-[10px] uppercase tracking-[0.12em] text-neutral-500 font-mono">
            Unrestricted administrator interface. Fully authorized to manipulate user tables, override catalog structures, and execute schema cascades.
          </p>
        </div>
        <div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-none border border-red-500/30 bg-red-500/5 hover:bg-red-500/15 text-red-500 hover:text-red-400 transition-all duration-300 font-mono text-[9px] uppercase tracking-widest px-6 py-4.5 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.02)]"
          >
            <Plus className="h-4 w-4" /> Mint New Product
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Live Products", value: products.length, icon: Package },
          { label: "Pending Pipeline Orders", value: orders.filter(o => o.status === "Pending").length, icon: Receipt },
          { label: "Total Asset Catalog Value", value: `€${products.reduce((sum, p) => sum + p.price * p.stock, 0).toLocaleString()}`, icon: Sparkles },
        ].map((card, i) => (
          <div key={i} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-none p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <card.icon className="h-10 w-10 text-white" />
            </div>
            <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-neutral-500">{card.label}</p>
            <p className="mt-3 font-mono text-2xl font-bold text-white tracking-widest">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Split Panels (Inventory & Orders) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Inventory Panel with Purge Action */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-none overflow-hidden">
          <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <Package className="h-4 w-4" /> Global Catalog Inventory
            </h2>
            <span className="text-[8px] font-mono tracking-widest text-red-500 uppercase">
              ROOT_OVERRIDE_ACTIVE
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[10px]">
              <thead>
                <tr className="border-b border-white/5 text-neutral-500 uppercase tracking-widest">
                  <th className="px-6 py-4 font-bold">SKU ID</th>
                  <th className="px-6 py-4 font-bold">Item Name</th>
                  <th className="px-6 py-4 font-bold">Stock</th>
                  <th className="px-6 py-4 font-bold text-right">Delete Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 text-neutral-400 tracking-wider">
                      {product.id.substring(0, 8).toUpperCase()}...
                    </td>
                    <td className="px-6 py-4 text-white uppercase font-semibold">
                      {product.name}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleAdjustStock(product.id, product.stock)}
                        className="text-[#ef4444] hover:underline"
                      >
                        {product.stock} Units
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setPurgeTarget(product)}
                        className="inline-flex items-center gap-1 border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 hover:border-red-500/30 px-3 py-2 text-[8px] uppercase tracking-widest transition-colors font-bold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Purge Asset
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Orders Feed */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-none overflow-hidden">
          <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <Receipt className="h-4 w-4" /> Recent Order Telemetry
            </h2>
            <span className="text-[8px] font-mono tracking-widest text-red-500 uppercase animate-pulse">
              TRANSITION_PIPELINE
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[10px]">
              <thead>
                <tr className="border-b border-white/5 text-neutral-500 uppercase tracking-widest">
                  <th className="px-6 py-4 font-bold">Order Code</th>
                  <th className="px-6 py-4 font-bold">Customer Email</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => {
                  let statusClass = "text-white";
                  if (order.status === "Pending") statusClass = "text-amber-400";
                  else if (order.status === "Shipped") statusClass = "text-blue-400";
                  else if (order.status === "Delivered") statusClass = "text-emerald-400";
                  else if (order.status === "Cancelled") statusClass = "text-red-500";

                  const canTransition = order.status === "Pending" || order.status === "Shipped";

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4 text-white font-bold tracking-wider">
                        {order.order_code}
                      </td>
                      <td className="px-6 py-4 text-neutral-400 truncate max-w-[120px]">
                        {order.customer_email}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 uppercase font-bold tracking-wider ${statusClass}`}>
                          <span className={`w-1 h-1 rounded-full ${order.status === "Pending" ? "bg-amber-400 animate-ping" : "currentColor"}`} />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {canTransition ? (
                          <button
                            onClick={() => handleUpdateStatus(order.id, order.status)}
                            disabled={actionLoading === order.id}
                            className="inline-flex items-center gap-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/30 text-red-500 px-3.5 py-2 text-[8px] uppercase tracking-widest font-bold font-mono transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {actionLoading === order.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                {order.status === "Pending" ? "Ship" : "Deliver"} <ArrowRight className="w-2.5 h-2.5" />
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[8px] uppercase font-bold tracking-widest text-neutral-600 font-mono">
                            <Check className="w-3 h-3 text-neutral-600" /> Complete
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* User Management Section */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-none overflow-hidden">
        <div className="border-b border-white/10 px-6 py-5 flex items-center gap-2">
          <Users className="h-4.5 w-4.5 text-red-500" />
          <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white">
            Operational Team User Management
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-[10px]">
            <thead>
              <tr className="border-b border-white/5 text-neutral-500 uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">Profile UUID</th>
                <th className="px-6 py-4 font-bold">Name</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold text-right">Configured Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {profiles.map((p) => {
                const userRole = p.email === "staff@aurastreet.com" ? "staff" : p.role;
                let roleColor = "text-white";
                if (userRole === "super_admin") roleColor = "text-red-500";
                else if (userRole === "admin") roleColor = "text-sky-400";
                else if (userRole === "staff") roleColor = "text-neutral-300";

                return (
                  <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 text-neutral-400">
                      {p.id}
                    </td>
                    <td className="px-6 py-4 text-white uppercase font-bold">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 text-neutral-400">
                      {p.email}
                    </td>
                    <td className={`px-6 py-4 text-right font-extrabold uppercase tracking-widest ${roleColor}`}>
                      {userRole}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Override Logs Terminal Component */}
      <div className="bg-black border border-white/10 rounded-none overflow-hidden font-mono">
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4.5 h-4.5 text-red-500" />
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-white">
              System Override Logs // active_monitor
            </span>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40 animate-pulse" />
          </div>
        </div>
        <div className="p-6 max-h-60 overflow-y-auto text-[9px] space-y-2.5 text-neutral-400 scrollbar-thin bg-black/80">
          {terminalLogs.map((log, idx) => {
            let textColor = "text-neutral-400";
            if (log.includes("[OK]")) textColor = "text-green-400";
            else if (log.includes("[!!! ALERT !!!]")) textColor = "text-red-500 font-bold";
            else if (log.includes("[SYS]")) textColor = "text-sky-400";
            else if (log.includes("SECURE DEPLOYMENT")) textColor = "text-white font-semibold";

            return (
              <div key={idx} className={`${textColor} tracking-wider font-mono`}>
                {log}
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Frosted Glassmorphic Side-Drawer Modal (Mint Product) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Overlay background */}
          <button
            type="button"
            aria-label="Close drawer"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer content panel */}
          <div className="relative w-full max-w-lg bg-black/90 border-l border-white/10 h-full p-8 md:p-10 flex flex-col justify-between overflow-y-auto backdrop-blur-xl animate-slide-in">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                  <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-red-500 mb-1">
                    ASSET FABRICATION NODE
                  </p>
                  <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">
                    Mint Design Asset
                  </h3>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg p-2 text-neutral-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mint Product Form */}
              <form onSubmit={handleCreateProduct} className="space-y-6 mt-8 font-mono text-xs">
                
                {/* Product Name */}
                <div className="space-y-2">
                  <label htmlFor="prod-name" className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">
                    Product Title *
                  </label>
                  <input
                    id="prod-name"
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="E.G. SHADOW PARKA III"
                    className="w-full bg-white/[0.02] border border-white/10 focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20 outline-none text-white px-4 py-3 rounded-none uppercase tracking-wider transition-colors placeholder:text-neutral-700"
                  />
                </div>

                {/* Price & Stock Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="prod-price" className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">
                      Price (EUR) *
                    </label>
                    <input
                      id="prod-price"
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="295.00"
                      className="w-full bg-white/[0.02] border border-white/10 focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20 outline-none text-white px-4 py-3 rounded-none transition-colors placeholder:text-neutral-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="prod-stock" className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">
                      Initial Stock *
                    </label>
                    <input
                      id="prod-stock"
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      placeholder="35"
                      className="w-full bg-white/[0.02] border border-white/10 focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20 outline-none text-white px-4 py-3 rounded-none transition-colors placeholder:text-neutral-700"
                    />
                  </div>
                </div>

                {/* Category & Colorways */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="prod-category" className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">
                      Category *
                    </label>
                    <select
                      id="prod-category"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-neutral-950 border border-white/10 focus:border-red-500/40 outline-none text-white px-4 py-3 rounded-none transition-colors"
                    >
                      {["Hoodies", "Jackets", "Pants", "Sneakers", "Accessories"].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="prod-colorways" className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">
                      Colorways
                    </label>
                    <input
                      id="prod-colorways"
                      type="number"
                      value={newProduct.colorways}
                      onChange={(e) => setNewProduct({ ...newProduct, colorways: e.target.value })}
                      placeholder="1"
                      className="w-full bg-white/[0.02] border border-white/10 focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20 outline-none text-white px-4 py-3 rounded-none transition-colors"
                    />
                  </div>
                </div>

                {/* Material */}
                <div className="space-y-2">
                  <label htmlFor="prod-material" className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">
                    Fabric / Material Composition
                  </label>
                  <input
                    id="prod-material"
                    type="text"
                    value={newProduct.material}
                    onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
                    placeholder="e.g. 450GSM Organic Japanese Cotton"
                    className="w-full bg-white/[0.02] border border-white/10 focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20 outline-none text-white px-4 py-3 rounded-none uppercase tracking-wider transition-colors placeholder:text-neutral-700"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="prod-description" className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">
                    Item Description
                  </label>
                  <textarea
                    id="prod-description"
                    rows={4}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Describe design accents, hardware zip specifications, fit drape silhouettes..."
                    className="w-full bg-white/[0.02] border border-white/10 focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20 outline-none text-white px-4 py-3 rounded-none transition-colors placeholder:text-neutral-700 resize-none"
                  />
                </div>

                {/* Action button */}
                <div className="pt-6 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={actionLoading === "create"}
                    className="w-full py-4 bg-white hover:bg-red-500 hover:text-white text-black font-bold uppercase tracking-widest text-[9px] font-mono transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading === "create" ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> MINTING ASSET...
                      </span>
                    ) : (
                      "COMPILE & MINT DESIGN ASSET"
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* Highly Stylized Red Warning Modal (Purge Product Asset) */}
      {purgeTarget && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

          {/* Modal Panel */}
          <div className="relative w-full max-w-md bg-black border border-red-500/40 p-8 rounded-none font-mono text-left z-10 shadow-[0_0_50px_rgba(239,68,68,0.15)] animate-modal-enter">
            {/* Warning Flashing Header */}
            <div className="flex items-start gap-4 pb-6 border-b border-red-500/20">
              <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-none text-red-500 animate-pulse">
                <ShieldAlert className="w-7.5 h-7.5" />
              </div>
              <div>
                <p className="text-[8px] text-red-500 font-extrabold uppercase tracking-[0.25em] mb-1">
                  SECURITY OVERRIDE RISK // CASCADE SYSTEM DELETE
                </p>
                <h3 className="font-display text-base font-bold uppercase tracking-wider text-white">
                  Purge Catalog Asset
                </h3>
              </div>
            </div>

            {/* Modal Body Info */}
            <div className="mt-6 space-y-4 text-neutral-400 text-xs">
              <p>
                You are about to execute an irreversible purge of the following catalog product asset:
              </p>
              <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-none space-y-1.5">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                  PRODUCT TARGET IDENTIFIER:
                </p>
                <p className="text-white uppercase font-bold text-sm tracking-wider">
                  {purgeTarget.name}
                </p>
                <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-mono">
                  UUID: {purgeTarget.id}
                </p>
              </div>
              <p className="text-[10px] text-red-400 uppercase font-bold">
                ⚠️ THIS ACTION CANNOT BE UNDONE. RELATIONAL ORDERS WILL BE ARCHIVED.
              </p>
              <div className="space-y-2 pt-2">
                <label htmlFor="purge-confirm-text" className="text-[9px] text-neutral-500 uppercase tracking-wider font-bold">
                  To proceed, enter the Product UUID:
                </label>
                <input
                  id="purge-confirm-text"
                  type="text"
                  value={purgeConfirmText}
                  onChange={(e) => setPurgeConfirmText(e.target.value)}
                  placeholder={purgeTarget.id}
                  className="w-full bg-white/[0.02] border border-red-500/20 focus:border-red-500/50 outline-none text-white px-4 py-3 rounded-none tracking-wider text-center transition-colors placeholder:text-neutral-800"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex gap-3 pt-6 border-t border-red-500/20">
              <button
                onClick={() => {
                  setPurgeTarget(null);
                  setPurgeConfirmText("");
                }}
                className="flex-1 py-3.5 border border-white/10 hover:bg-white/5 text-neutral-400 hover:text-white uppercase tracking-widest font-bold text-[9px] transition-colors cursor-pointer"
              >
                ABORT SEQUENCE
              </button>
              <button
                onClick={handlePurgeProduct}
                disabled={purgeConfirmText !== purgeTarget.id || actionLoading === purgeTarget.id}
                className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 disabled:bg-neutral-900 disabled:text-neutral-700 text-white font-bold uppercase tracking-widest text-[9px] transition-colors disabled:border-transparent cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.1)]"
              >
                {actionLoading === purgeTarget.id ? "PURGING..." : "EXECUTE PURGE"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer and Modal styling */}
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes modal-enter {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-modal-enter {
          animation: modal-enter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
