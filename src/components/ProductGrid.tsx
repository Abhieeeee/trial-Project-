"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Eye } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  sizes: string[];
  isThreeD?: boolean;
}

const products: Product[] = [
  {
    id: "essential-hoodie",
    name: "Aura 3D Hoodie",
    price: "€245",
    category: "Heavy Fleece // Matte Black",
    image: "/logo.png", // Will display placeholder or interactive text
    sizes: ["S", "M", "L", "XL"],
    isThreeD: true,
  },
  {
    id: "moto-jacket",
    name: "Aura Moto Jacket",
    price: "€680",
    category: "Premium Calf Leather",
    image: "/moto-jacket.png",
    sizes: ["M", "L", "XL"],
  },
  {
    id: "tech-cargos",
    name: "Gore-Tex Tech Cargos",
    price: "€320",
    category: "Waterproof // Modular",
    image: "/tech-cargos.png",
    sizes: ["28", "30", "32", "34"],
  },
  {
    id: "street-sneakers",
    name: "Aura Street Runner",
    price: "€410",
    category: "Futuristic // Chrome Accent",
    image: "/street-sneaker.png",
    sizes: ["40", "41", "42", "43", "44"],
  },
];

export default function ProductGrid() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section id="shop" className="py-32 bg-black relative z-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-sky text-glow-sky mb-3 font-semibold">
              Drop 01 // Selected Garments
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.15em] font-display">
              The Collection
            </h2>
          </div>
          <p className="text-xs text-neutral-500 max-w-sm tracking-wide leading-relaxed">
            Constructed using heavy-cotton blends, waterproof tech fabrics, and luxury hardware. Tailored for modern silhouettes.
          </p>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              className="group flex flex-col justify-between rounded-xl overflow-hidden glass-panel-glow border-neutral-900 bg-neutral-950/20 transition-all duration-500 hover:border-neutral-800"
            >
              
              {/* Product Image Area */}
              <div className="aspect-[4/5] w-full bg-neutral-950/80 relative flex items-center justify-center overflow-hidden">
                {product.isThreeD ? (
                  /* 3D Hoodie Card Layout */
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-neutral-950 to-neutral-900/60 text-center">
                    {/* Glowing Accent Ring */}
                    <div className="w-24 h-24 rounded-full border border-brand-sky/20 flex items-center justify-center mb-6 relative group-hover:border-brand-sky/50 transition-colors duration-500">
                      <div className="absolute inset-2 rounded-full border border-dashed border-brand-sky/10 animate-[spin_20s_linear_infinite]" />
                      <Eye className="w-8 h-8 text-neutral-400 group-hover:text-brand-sky transition-colors duration-500" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-sky text-glow-sky mb-1">
                      Interactive 3D Model
                    </span>
                    <p className="text-[11px] text-neutral-500 max-w-[180px] tracking-wide mt-2">
                      Hover & rotate the custom hoodie preview above.
                    </p>
                  </div>
                ) : (
                  /* Standard Image Card Layout */
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}

                {/* Glassmorphic Hover Overlay for sizes */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex flex-col justify-end p-6 gap-4">
                  <div className="flex flex-col gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                      Select Size:
                    </span>
                    <div className="flex gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          className="w-8 h-8 rounded border border-neutral-800 text-[10px] font-medium hover:border-brand-sky hover:text-brand-sky transition-colors"
                          data-hover
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to bag button */}
                  <button
                    className="w-full py-3 bg-white text-black hover:bg-brand-sky hover:text-black transition-colors rounded text-[10px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out delay-[50ms]"
                    data-magnetic
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>

                {/* Subtle sky glow bar at top of card on hover */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-sky scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
              </div>

              {/* Product Info Area */}
              <div className="p-6 flex flex-col justify-between grow">
                <div className="flex items-start justify-between mb-2 gap-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-white">
                    {product.name}
                  </h3>
                  <span className="text-sm font-medium text-white">{product.price}</span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-900">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">
                    {product.category}
                  </span>
                  {product.isThreeD && (
                    <span className="text-[8px] uppercase tracking-[0.2em] bg-brand-sky/10 border border-brand-sky/20 text-brand-sky px-2 py-0.5 rounded-full">
                      3D Config
                    </span>
                  )}
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>

        {/* Global CTA Bottom */}
        <div className="mt-20 text-center">
          <button
            className="px-10 py-4.5 rounded-full border border-neutral-800 text-[11px] uppercase tracking-[0.35em] font-semibold text-neutral-400 hover:text-white hover:border-brand-sky hover:bg-neutral-950/60 transition-all duration-300 cursor-pointer"
            data-magnetic
          >
            Explore All Items
          </button>
        </div>

      </div>
    </section>
  );
}
