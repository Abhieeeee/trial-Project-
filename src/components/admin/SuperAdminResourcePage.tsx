import { Archive, Download, PackageSearch, Plus, ShieldAlert, UsersRound, Warehouse } from "lucide-react";

import { products } from "@/lib/catalog";

type ResourceKind = "products" | "customers" | "inventory";

const resourceConfig = {
  products: {
    eyebrow: "Global catalog control",
    title: "Products",
    description: "Control pricing, publishing, imports, product deletion, and every catalog variant.",
    primaryAction: "Add product",
    secondaryAction: "Bulk import",
    icon: PackageSearch,
    metrics: [
      ["Live products", "126"],
      ["Drafts", "18"],
      ["Limited drops", "4"],
      ["Catalog value", "EUR 842K"],
    ],
  },
  customers: {
    eyebrow: "Customer administration",
    title: "Customers",
    description: "Manage customer access, exports, segments, store credit, rewards, and account restrictions.",
    primaryAction: "Create segment",
    secondaryAction: "Export data",
    icon: UsersRound,
    metrics: [
      ["Total customers", "8,234"],
      ["VIP members", "486"],
      ["New this month", "624"],
      ["Average LTV", "EUR 418"],
    ],
  },
  inventory: {
    eyebrow: "Warehouse authority",
    title: "Inventory",
    description: "Control warehouses, transfers, stock reconciliation, thresholds, SKUs, and archived inventory.",
    primaryAction: "New transfer",
    secondaryAction: "Export report",
    icon: Warehouse,
    metrics: [
      ["Tracked SKUs", "126"],
      ["Units on hand", "5,482"],
      ["Low stock", "7"],
      ["Warehouses", "3"],
    ],
  },
} as const;

interface SuperAdminResourcePageProps {
  kind: ResourceKind;
}

export function SuperAdminResourcePage({ kind }: SuperAdminResourcePageProps) {
  const config = resourceConfig[kind];

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-brand-sky">{config.eyebrow}</p>
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-white">{config.title}</h1>
          <p className="mt-3 max-w-2xl text-xs uppercase tracking-[0.12em] text-neutral-400">{config.description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="inline-flex items-center gap-2 rounded-md border border-neutral-700 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-white hover:border-brand-sky">
            <Download className="h-3.5 w-3.5" />{config.secondaryAction}
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-black hover:bg-brand-sky">
            <Plus className="h-3.5 w-3.5" />{config.primaryAction}
          </button>
        </div>
      </div>

      <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {config.metrics.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
            <config.icon className="mb-4 h-4 w-4 text-brand-sky" />
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-500">{label}</p>
            <p className="mt-2 text-xl font-bold text-white">{value}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-800 p-5">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">{config.title} control list</h2>
          <span className="inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.14em] text-red-400">
            <ShieldAlert className="h-3.5 w-3.5" />Elevated controls enabled
          </span>
        </div>
        {products.slice(0, 6).map((product) => (
          <div key={product.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-800 p-5 last:border-0 md:grid-cols-[1fr_1fr_auto]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                {kind === "customers" ? `${product.name} buyer group` : product.name}
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.13em] text-neutral-500">
                {kind === "inventory" ? `${product.id} / Paris warehouse` : `${product.id} / ${product.category}`}
              </p>
            </div>
            <div className="hidden text-[10px] uppercase tracking-[0.13em] text-neutral-400 md:block">
              {kind === "customers" ? "Active / Sky tier" : kind === "inventory" ? `${product.stock} units available` : `${product.price} / Published`}
            </div>
            <div className="flex gap-2">
              <button type="button" title={`Edit ${kind}`} className="rounded-md border border-neutral-700 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.12em] text-white hover:border-brand-sky">Edit</button>
              <button type="button" title={`Archive ${kind}`} className="rounded-md border border-red-500/20 p-2 text-red-400 hover:bg-red-500/10"><Archive className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

