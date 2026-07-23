
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
  Download,
  Upload,
  Database,
  Search,
  Filter,
  Sliders,
} from "lucide-react";
import { NicheAnalyticsHub } from "@/components/admin/NicheAnalyticsHub";
import { DataManagementModal } from "@/components/admin/DataManagementModal";

export default function AdminConsole() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Drawers
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Search & Filters
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

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
      const { error } = await supabase.from("products").insert([
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
    else return;

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
      alert("Invalid stock level entered.");
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

  // Filtered Lists
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) =>
    o.order_code.toLowerCase().includes(orderSearch.toLowerCase()) || o.customer_email.toLowerCase().includes(orderSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-[10px] uppercase tracking-widest text-[#00d2ff]">
        Syncing admin console core...
      </div>
    );
  }

  return (
    <div className="space-y-10 relative">

      {/* Header Bar */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between border-b border-[#00d2ff]/20 pb-6">
        <div>
          <p className="mb-2 text-[8px] font-mono uppercase tracking-[0.3em] text-[#00d2ff]">
            ADMIN OPERATIONS CORE // FULL EDIT & WRITE RIGHTS ENABLED
          </p>
          <h1 className="font-display text-3xl font-bold uppercase tracking-[0.15em] text-white">
            Admin Dashboard Console
          </h1>
          <p className="mt-2 max-w-xl text-[10px] uppercase tracking-[0.12em] text-neutral-400 font-mono">
            Elevated operations node. Authorized to publish catalogs, mint apparel inventory, process orders, and export/import store telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setDataModalOpen(true)}
            className="inline-flex items-center gap-2 border border-[#00d2ff]/30 bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] transition-all duration-300 font-mono text-[9px] uppercase tracking-widest px-5 py-3.5 cursor-pointer"
          >
            <Database className="h-4 w-4" /> Import / Export Data
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 border border-white/20 bg-white hover:bg-neutral-200 text-black font-bold transition-all duration-300 font-mono text-[9px] uppercase tracking-widest px-6 py-3.5 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <Plus className="h-4 w-4" /> Mint Apparel SKU
          </button>
        </div>
      </div>

      {/* Embedded Niche Analytics Hub (Admin Sky Theme) */}
      <NicheAnalyticsHub products={products} orders={orders} role="admin" onRefresh={loadData} />

      {/* Split Panels: Products Catalog & Order Fulfillment Management */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Active Products Catalog */}
        <div className="bg-black/40 backdrop-blur-md border border-neutral-800 rounded-none overflow-hidden space-y-4">
          <div className="border-b border-neutral-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <Package className="h-4 w-4 text-[#00d2ff]" /> Active Apparel Catalog ({filteredProducts.length})
            </h2>
            <div className="relative font-mono text-[9px]">
              <Search className="h-3 w-3 absolute left-2.5 top-2.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search Item..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full sm:w-48 bg-neutral-900 border border-neutral-800 pl-7 pr-2 py-1 text-white placeholder-neutral-600 focus:outline-none focus:border-[#00d2ff]"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left border-collapse font-mono text-[10px]">
              <thead className="bg-neutral-950 sticky top-0 border-b border-neutral-800 text-neutral-500 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3 font-bold">Item Name</th>
                  <th className="px-6 py-3 font-bold">Price</th>
                  <th className="px-6 py-3 font-bold">Stock</th>
                  <th className="px-6 py-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.01]">
                    <td className="px-6 py-3.5">
                      <p className="text-white uppercase font-bold">{product.name}</p>
                      <p className="text-[8px] text-neutral-500">{product.category} — {product.material}</p>
                    </td>
                    <td className="px-6 py-3.5 text-[#00d2ff] font-bold">
                      EUR {product.price}
                    </td>
                    <td className={`px-6 py-3.5 font-bold ${product.stock <= 15 ? "text-amber-400" : "text-white"}`}>
                      {product.stock} Units
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleAdjustStock(product.id, product.stock)}
                        disabled={actionLoading === product.id}
                        className="px-3 py-1 border border-neutral-800 hover:border-[#00d2ff] text-[8px] text-neutral-300 hover:text-[#00d2ff] uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        {actionLoading === product.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Adjust Stock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Fulfillment Control Panel */}
        <div className="bg-black/40 backdrop-blur-md border border-neutral-800 rounded-none overflow-hidden space-y-4">
          <div className="border-b border-neutral-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <Receipt className="h-4 w-4 text-[#00d2ff]" /> Fulfillment Pipeline ({filteredOrders.length})
            </h2>
            <div className="relative font-mono text-[9px]">
              <Search className="h-3 w-3 absolute left-2.5 top-2.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search Order Code..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full sm:w-48 bg-neutral-900 border border-neutral-800 pl-7 pr-2 py-1 text-white placeholder-neutral-600 focus:outline-none focus:border-[#00d2ff]"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left border-collapse font-mono text-[10px]">
              <thead className="bg-neutral-950 sticky top-0 border-b border-neutral-800 text-neutral-500 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3 font-bold">Code</th>
                  <th className="px-6 py-3 font-bold">Total</th>
                  <th className="px-6 py-3 font-bold">Status</th>
                  <th className="px-6 py-3 font-bold text-right">Transition State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.01]">
                    <td className="px-6 py-3.5 font-bold text-white">
                      {order.order_code}
                      <p className="text-[8px] text-neutral-500 font-normal truncate max-w-[120px]">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-3.5 text-[#00d2ff] font-bold">
                      EUR {order.total}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`uppercase font-bold tracking-wider ${order.status === "Pending" ? "text-amber-400" : order.status === "Shipped" ? "text-[#00d2ff]" : order.status === "Delivered" ? "text-emerald-400" : "text-red-500"
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {order.status !== "Delivered" && order.status !== "Cancelled" ? (
                        <button
                          onClick={() => handleUpdateStatus(order.id, order.status)}
                          disabled={actionLoading === order.id}
                          className="px-3 py-1 border border-[#00d2ff]/30 bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[8px] text-[#00d2ff] font-bold uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          {actionLoading === order.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              Mark {order.status === "Pending" ? "Shipped" : "Delivered"} <ArrowRight className="h-3 w-3" />
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[8px] text-neutral-500 uppercase tracking-widest">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Mint Product Slide-Over Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-neutral-950 border-l border-neutral-800 p-6 flex flex-col justify-between h-full font-mono">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-6">
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
                  Mint New Apparel SKU
                </h3>
                <button onClick={() => setDrawerOpen(false)} className="text-neutral-500 hover:text-white cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} id="mintForm" className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase text-[9px] text-neutral-400 mb-1">Item Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cyberpunk Tech Jacket"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-[#00d2ff]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-[9px] text-neutral-400 mb-1">Price (EUR)</label>
                    <input
                      type="number"
                      required
                      placeholder="180"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-[#00d2ff]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-[9px] text-neutral-400 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      placeholder="25"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-[#00d2ff]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-[9px] text-neutral-400 mb-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-[#00d2ff]"
                    >
                      <option value="Hoodies">Hoodies</option>
                      <option value="Jackets">Jackets</option>
                      <option value="Pants">Pants</option>
                      <option value="Sneakers">Sneakers</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block uppercase text-[9px] text-neutral-400 mb-1">Material Fabric</label>
                    <input
                      type="text"
                      placeholder="Tech Weave"
                      value={newProduct.material}
                      onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-[#00d2ff]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase text-[9px] text-neutral-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Short product overview..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-[#00d2ff]"
                  />
                </div>
              </form>
            </div>

            <div className="pt-4 border-t border-neutral-900 flex gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex-1 py-3 border border-neutral-800 text-neutral-400 hover:text-white uppercase tracking-widest text-[9px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="mintForm"
                disabled={actionLoading === "create"}
                className="flex-1 py-3 bg-[#00d2ff] text-black font-bold uppercase tracking-widest text-[9px] hover:bg-[#00b5dc] cursor-pointer flex items-center justify-center gap-2"
              >
                {actionLoading === "create" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mint SKU"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Import & Export Modal */}
      <DataManagementModal
        isOpen={dataModalOpen}
        onClose={() => setDataModalOpen(false)}
        role="admin"
        onSuccess={loadData}
      />
    </div>
  );
}
