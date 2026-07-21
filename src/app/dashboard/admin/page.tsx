"use client";

import { useEffect, useState } from "react";
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
  Compass,
  Check,
} from "lucide-react";

export default function AdminConsole() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

  const supabase = createClient();

  async function loadData() {
    try {
      const [prodResult, ordResult] = await Promise.all([
        supabase.from("products").select("*").order("name"),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
      ]);

      if (prodResult.data) setProducts(prodResult.data as Product[]);
      if (ordResult.data) setOrders(ordResult.data as Order[]);
    } catch (err) {
      console.error("Error loading admin console data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    setActionLoading("create");

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
      } else {
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
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUpdateStatus(orderId: string, currentStatus: string) {
    let nextStatus: Order["status"] = "Pending";
    if (currentStatus === "Pending") nextStatus = "Shipped";
    else if (currentStatus === "Shipped") nextStatus = "Delivered";
    else return; // Ignore if already delivered or cancelled

    setActionLoading(orderId);

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) {
        alert(`Failed to update order status: ${error.message}`);
      } else {
        await loadData();
      }
    } catch (err: any) {
      alert(`Error updating order: ${err.message}`);
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

    try {
      const { error } = await supabase
        .from("products")
        .update({ stock: amount, updated_at: new Date().toISOString() })
        .eq("id", productId);

      if (error) {
        alert(`Failed to update stock: ${error.message}`);
      } else {
        await loadData();
      }
    } catch (err: any) {
      alert(`Error updating stock: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-[10px] uppercase tracking-widest text-[#00d2ff]">
        Syncing admin console terminal...
      </div>
    );
  }

  return (
    <div className="space-y-12 relative">
      
      {/* Page Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-[8px] font-mono uppercase tracking-[0.3em] text-[#00d2ff]">
            SECURE ACCESS LAYER // EDIT & COMPILE RIGHTS ENABLED
          </p>
          <h1 className="font-display text-2xl font-bold uppercase tracking-[0.15em] text-white">
            Admin Console
          </h1>
          <p className="mt-2 max-w-xl text-[10px] uppercase tracking-[0.12em] text-neutral-500 font-mono">
            Elevated operations node. Authorized to publish catalogs, mint design inventory, and transition order fulfillment states.
          </p>
        </div>
        <div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-none border border-[#00d2ff]/30 bg-[#00d2ff]/5 hover:bg-[#00d2ff]/15 text-[#00d2ff] hover:text-[#00d2ff]/80 transition-all duration-300 font-mono text-[9px] uppercase tracking-widest px-6 py-4.5 cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.02)]"
          >
            <Plus className="h-4 w-4" /> Mint New Product
          </button>
        </div>
      </div>

      {/* Overview Cards */}
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

      {/* Main Content Split Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Inventory Panel */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-none overflow-hidden">
          <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <Package className="h-4 w-4" /> Global Catalog Inventory
            </h2>
            <span className="text-[8px] font-mono tracking-widest text-[#00d2ff] uppercase">
              WRITE_EDIT
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[10px]">
              <thead>
                <tr className="border-b border-white/5 text-neutral-500 uppercase tracking-widest">
                  <th className="px-6 py-4 font-bold">SKU ID</th>
                  <th className="px-6 py-4 font-bold">Item Name</th>
                  <th className="px-6 py-4 font-bold">Price</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
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
                    <td className="px-6 py-4 text-neutral-400">
                      €{product.price}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleAdjustStock(product.id, product.stock)}
                        disabled={actionLoading === product.id}
                        className="inline-flex items-center gap-1 border border-[#00d2ff]/20 bg-[#00d2ff]/5 text-[#00d2ff] hover:bg-[#00d2ff]/10 hover:border-[#00d2ff]/30 px-3 py-2 text-[8px] uppercase tracking-widest transition-colors font-bold disabled:opacity-50 cursor-pointer"
                      >
                        {actionLoading === product.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          `Stock: ${product.stock}`
                        )}
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
            <span className="text-[8px] font-mono tracking-widest text-[#00d2ff] uppercase animate-pulse">
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
                            className="inline-flex items-center gap-2 border border-[#00d2ff]/20 bg-[#00d2ff]/5 hover:bg-[#00d2ff]/10 hover:border-[#00d2ff]/30 text-[#00d2ff] px-3.5 py-2 text-[8px] uppercase tracking-widest font-bold font-mono transition-colors disabled:opacity-50 cursor-pointer"
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
                  <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-[#00d2ff] mb-1">
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
                    className="w-full bg-white/[0.02] border border-white/10 focus:border-[#00d2ff]/40 focus:ring-1 focus:ring-[#00d2ff]/20 outline-none text-white px-4 py-3 rounded-none uppercase tracking-wider transition-colors placeholder:text-neutral-700"
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
                      className="w-full bg-white/[0.02] border border-white/10 focus:border-[#00d2ff]/40 focus:ring-1 focus:ring-[#00d2ff]/20 outline-none text-white px-4 py-3 rounded-none transition-colors placeholder:text-neutral-700"
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
                      className="w-full bg-white/[0.02] border border-white/10 focus:border-[#00d2ff]/40 focus:ring-1 focus:ring-[#00d2ff]/20 outline-none text-white px-4 py-3 rounded-none transition-colors placeholder:text-neutral-700"
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
                      className="w-full bg-neutral-950 border border-white/10 focus:border-[#00d2ff]/40 outline-none text-white px-4 py-3 rounded-none transition-colors"
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
                      className="w-full bg-white/[0.02] border border-white/10 focus:border-[#00d2ff]/40 focus:ring-1 focus:ring-[#00d2ff]/20 outline-none text-white px-4 py-3 rounded-none transition-colors"
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
                    className="w-full bg-white/[0.02] border border-white/10 focus:border-[#00d2ff]/40 focus:ring-1 focus:ring-[#00d2ff]/20 outline-none text-white px-4 py-3 rounded-none uppercase tracking-wider transition-colors placeholder:text-neutral-700"
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
                    className="w-full bg-white/[0.02] border border-white/10 focus:border-[#00d2ff]/40 focus:ring-1 focus:ring-[#00d2ff]/20 outline-none text-white px-4 py-3 rounded-none transition-colors placeholder:text-neutral-700 resize-none"
                  />
                </div>

                {/* Action button */}
                <div className="pt-6 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={actionLoading === "create"}
                    className="w-full py-4 bg-white hover:bg-[#00d2ff] hover:text-black text-black font-bold uppercase tracking-widest text-[9px] font-mono transition-colors disabled:opacity-50 cursor-pointer"
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

      {/* Slide in drawer styling */}
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
