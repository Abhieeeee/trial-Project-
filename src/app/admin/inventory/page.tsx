"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Barcode, Boxes, Warehouse } from "lucide-react";

import { products } from "@/lib/catalog";

export default function AdminInventoryPage() {
  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-white mb-2">Inventory</h1>
        <p className="text-xs text-neutral-400 uppercase tracking-widest">
          Stock tracking, low stock alerts, SKU management, barcode support, and warehouse controls.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        {[
          { icon: Boxes, title: "Tracked SKUs", value: "126" },
          { icon: AlertTriangle, title: "Low Stock", value: "7" },
          { icon: Barcode, title: "Barcodes", value: "Ready" },
          { icon: Warehouse, title: "Warehouses", value: "3" },
        ].map((item) => (
          <div key={item.title} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <item.icon className="w-5 h-5 text-brand-sky mb-4" />
            <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 mb-2">{item.title}</p>
            <div className="text-2xl font-display font-bold">{item.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.04 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 p-5 border-b border-neutral-800 last:border-b-0 text-[10px] uppercase tracking-[0.18em] text-neutral-500"
          >
            <div><span className="block text-white">{product.id}</span>SKU</div>
            <div className="md:col-span-2"><span className="block text-white">{product.name}</span>Product</div>
            <div><span className={product.stock <= 12 ? "block text-red-400" : "block text-brand-sky"}>{product.stock}</span>Stock</div>
            <div><span className="block text-white">Paris WH</span>Warehouse</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
