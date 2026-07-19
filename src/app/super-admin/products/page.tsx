"use client";

import { useState, useEffect } from "react";
import { Plus, Download, Edit, Trash2, ShieldAlert, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database";

export default function SuperAdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = createClient();

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (!error && data) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you absolutely sure you want to delete this product? This action cannot be undone.")) return;
    setUpdatingId(productId);
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    } else {
      alert(`Delete failed: ${error.message}`);
    }
    setUpdatingId(null);
  };

  // Metrics
  const totalValue = products.reduce((sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0), 0);
  const totalStock = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const limitedDropCount = products.filter(p => p.category === "Jackets").length; // just a simple categorization

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-red-500">Global catalog control</p>
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-white">Products</h1>
          <p className="mt-3 max-w-2xl text-xs uppercase tracking-[0.12em] text-neutral-400">
            Control pricing, publishing, imports, product deletion, and every catalog variant.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products));
              const downloadAnchor = document.createElement("a");
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", "all_products.json");
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="inline-flex items-center gap-2 rounded-md border border-neutral-700 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-white hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Bulk Export
          </button>
          <button
            onClick={() => {
              const id = prompt("Enter product ID (e.g. AS-HDY-007):");
              const name = prompt("Enter product Name:");
              const price = Number(prompt("Enter product Price:"));
              const stock = Number(prompt("Enter initial Stock:"));
              if (id && name && price && stock) {
                supabase
                  .from("products")
                  .insert([
                    {
                      id,
                      name,
                      price,
                      stock,
                      category: "Hoodies",
                      material: "Organic Cotton Blend",
                      colorways: 1,
                      is_active: true,
                      images: ["/hero-editorial.png"],
                      description: "New architectural hoodie drop.",
                    },
                  ])
                  .then(({ error }) => {
                    if (error) alert(`Create failed: ${error.message}`);
                    else fetchProducts();
                  });
              }
            }}
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-black hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Product
          </button>
        </div>
      </div>

      <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          ["Live products", products.length.toString()],
          ["Total Stock Units", totalStock.toString()],
          ["Limited drops", limitedDropCount.toString()],
          ["Catalog value", `EUR ${totalValue.toLocaleString()}`],
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
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Products Control List</h2>
          <span className="inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.14em] text-red-400">
            <ShieldAlert className="h-3.5 w-3.5" />Elevated controls enabled
          </span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-xs uppercase tracking-widest text-neutral-500">
            Loading products catalog...
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-xs uppercase tracking-widest text-neutral-500">
            No products in database.
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-800 p-5 last:border-0 md:grid-cols-[1fr_1fr_auto]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                  {product.name}
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.13em] text-neutral-500">
                  {product.id} / {product.category}
                </p>
              </div>
              <div className="hidden text-[10px] uppercase tracking-[0.13em] text-neutral-400 md:block">
                EUR {product.price} / {product.stock} units
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newPrice = Number(prompt(`Enter new price for ${product.name}:`, product.price.toString()));
                    if (newPrice && !isNaN(newPrice)) {
                      setUpdatingId(product.id);
                      supabase
                        .from("products")
                        .update({ price: newPrice, updated_at: new Date().toISOString() })
                        .eq("id", product.id)
                        .then(({ error }) => {
                          if (error) alert(error.message);
                          else fetchProducts();
                        });
                    }
                  }}
                  disabled={updatingId === product.id}
                  className="rounded-md border border-neutral-700 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.12em] text-white hover:border-red-500 cursor-pointer"
                >
                  Adjust Price
                </button>
                <button
                  type="button"
                  onClick={() => deleteProduct(product.id)}
                  disabled={updatingId === product.id}
                  title="Archive/Delete Product"
                  className="rounded-md border border-red-500/20 p-2 text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
