import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Heart, PackageCheck, Ruler, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";

import PageShell from "@/components/PageShell";
import StoreProductCard from "@/components/StoreProductCard";
import { products } from "@/lib/catalog";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const related = products.filter((item) => item.slug !== product.slug).slice(0, 4);

  return (
    <PageShell>
      <section className="px-6 md:px-12 max-w-7xl mx-auto pt-36 md:pt-44 pb-24">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="grid gap-5">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden glass-panel-glow">
              <Image src={product.image} alt={product.name} fill priority className="object-cover" />
              {product.badge && (
                <span className="absolute top-5 left-5 rounded-full border border-brand-sky/30 bg-black/70 px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] text-brand-sky">
                  {product.badge}
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[product.image, "/hero-editorial.png", "/editorial-spread.png"].map((image, index) => (
                <div key={`${image}-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-900 bg-neutral-950">
                  <Image src={image} alt={`${product.name} view ${index + 1}`} fill className="object-cover opacity-80" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-28">
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-sky text-glow-sky font-bold mb-5">
              {product.category} · {product.id}
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-[0.08em] font-display text-white">
              {product.name}
            </h1>
            <div className="mt-5 flex items-center gap-4">
              <span className="text-2xl font-display font-bold text-brand-sky">{product.price}</span>
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                <Star className="w-3.5 h-3.5 fill-brand-sky text-brand-sky" />
                4.9 // 128 Reviews
              </span>
            </div>
            <p className="mt-8 text-sm md:text-base text-neutral-400 leading-relaxed tracking-wide">
              {product.description}
            </p>

            <div className="mt-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400">Select Size</span>
                <Link href="/sizing" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-brand-sky">
                  <Ruler className="w-3 h-3" />
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button key={size} className="h-11 min-w-12 rounded border border-neutral-800 px-4 text-xs font-bold hover:border-brand-sky hover:text-brand-sky transition-colors">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              <Link href="/cart" className="h-14 rounded bg-white text-black hover:bg-brand-sky transition-colors flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.22em] font-extrabold">
                <ShoppingBag className="w-4 h-4" />
                Add to Bag
              </Link>
              <button className="h-14 rounded border border-neutral-800 px-5 text-neutral-300 hover:border-brand-sky hover:text-white transition-colors" aria-label="Add to wishlist">
                <Heart className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-10 grid gap-3">
              {[
                { icon: Truck, title: "Free shipping over EUR 200" },
                { icon: ShieldCheck, title: "Secure payment states ready" },
                { icon: PackageCheck, title: `${product.stock} units available` },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 rounded-lg border border-neutral-900 bg-neutral-950/60 p-4">
                  <item.icon className="w-4 h-4 text-brand-sky" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">{item.title}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-neutral-900 pt-8">
              <h2 className="text-xs uppercase tracking-[0.25em] font-bold mb-5">Product Details</h2>
              <ul className="grid gap-3 text-sm text-neutral-400">
                {product.details.map((detail) => (
                  <li key={detail} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-sky" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-32">
        <div className="flex items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-sky text-glow-sky mb-3 font-semibold">
              Related System
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.12em] font-display">
              Complete The Fit
            </h2>
          </div>
          <Link href="/shop" className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-brand-sky">
            Shop all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {related.map((item) => (
            <StoreProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
