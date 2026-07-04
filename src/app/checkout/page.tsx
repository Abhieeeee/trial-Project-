import { CreditCard, Home, PackageCheck } from "lucide-react";

import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";
import { checkoutFeatures } from "@/lib/catalog";

export default function CheckoutPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Checkout"
        title="Secure multi-step checkout"
        text="A production-ready checkout path can connect to Stripe, Apple Pay, Google Pay, cash on delivery, and bank transfer once environment keys are configured."
      />
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-28 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-6">
          <Panel icon={Home} title="Shipping Address">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Email", "Full Name", "Address Line", "City", "Postal Code", "Country"].map((field) => (
                <input
                  key={field}
                  placeholder={field.toUpperCase()}
                  className="bg-black border border-neutral-800 rounded-lg py-4 px-4 text-[10px] uppercase tracking-[0.2em] focus:outline-none focus:border-brand-sky transition-colors text-white placeholder:text-neutral-700"
                />
              ))}
            </div>
          </Panel>
          <Panel icon={CreditCard} title="Payment Method">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Stripe Card", "Apple Pay", "Google Pay", "Cash On Delivery", "Bank Transfer"].map((method) => (
                <button key={method} className="rounded-lg border border-neutral-800 p-4 text-left text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:border-brand-sky hover:text-white transition-colors">
                  {method}
                </button>
              ))}
            </div>
          </Panel>
        </div>

        <aside className="glass-panel-glow rounded-xl p-6 h-fit lg:sticky lg:top-28">
          <h2 className="flex items-center gap-3 text-lg font-display font-bold uppercase tracking-[0.15em] mb-6">
            <PackageCheck className="w-5 h-5 text-brand-sky" />
            Review
          </h2>
          <div className="space-y-4 text-xs uppercase tracking-[0.18em] text-neutral-400">
            <div className="flex justify-between"><span>Subtotal</span><span>EUR 925</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>EUR 0</span></div>
            <div className="flex justify-between"><span>Taxes</span><span>At payment</span></div>
            <div className="border-t border-neutral-900 pt-4 flex justify-between text-white"><span>Total</span><span className="text-brand-sky">EUR 925</span></div>
          </div>
          <button className="mt-8 w-full h-14 rounded bg-white text-black hover:bg-brand-sky transition-colors text-[10px] uppercase tracking-[0.22em] font-extrabold">
            Place Order
          </button>
        </aside>
      </section>
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-28 grid grid-cols-1 md:grid-cols-4 gap-5">
        {checkoutFeatures.map((item) => (
          <div key={item.title} className="glass-panel rounded-xl border border-white/5 p-6">
            <item.icon className="w-5 h-5 text-brand-sky mb-5" />
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-3">{item.title}</h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}

function Panel({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <section className="glass-panel-glow rounded-xl p-6">
      <h2 className="flex items-center gap-3 text-lg font-display font-bold uppercase tracking-[0.15em] mb-6">
        <Icon className="w-5 h-5 text-brand-sky" />
        {title}
      </h2>
      {children}
    </section>
  );
}
