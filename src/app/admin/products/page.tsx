"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Edit, Plus, Search, Upload } from "lucide-react";

import { products } from "@/lib/catalog";

export default function AdminProductsPage() {
  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-white mb-2">Products</h1>
          <p className="text-xs text-neutral-400 uppercase tracking-widest">
            Add products, variants, tags, product media, and bulk upload inventory.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-3 rounded bg-neutral-900 border border-neutral-800 text-[10px] uppercase tracking-widest font-bold text-neutral-400 hover:text-white">
            <Upload className="w-4 h-4 inline mr-2" />
            Bulk Upload
          </button>
          <button className="px-4 py-3 rounded bg-white text-black hover:bg-brand-sky text-[10px] uppercase tracking-widest font-bold">
            <Plus className="w-4 h-4 inline mr-2" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input className="w-full bg-black border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-brand-sky text-white placeholder:text-neutral-600" placeholder="Search products..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden"
          >
            <div className="relative aspect-[16/10] bg-black">
              <Image src={product.image} alt={product.name} fill className="object-cover opacity-80" />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm uppercase tracking-[0.16em] font-bold">{product.name}</h2>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-2">{product.id}</p>
                </div>
                <button className="p-2 rounded border border-neutral-800 hover:border-brand-sky hover:text-brand-sky">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-6 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                <div><span className="block text-white">{product.price}</span>Price</div>
                <div><span className="block text-white">{product.stock}</span>Stock</div>
                <div><span className="block text-white">{product.sizes.length}</span>Sizes</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
